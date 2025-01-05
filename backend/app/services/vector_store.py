from typing import List, Dict
from openai import AsyncOpenAI
from pinecone import Pinecone
import logging
import os
from dotenv import load_dotenv
import uuid
import re

load_dotenv()

logger = logging.getLogger(__name__)


class TennisVectorStore:
    def __init__(self):
        # Initialize Pinecone with new syntax
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

        # Connect directly to the index
        self.index = pc.Index("tennis")
        self.openai = AsyncOpenAI()

    async def store_matches(self, matches: List[Dict]):
        """Store processed match data in vector database"""
        batch_size = 100

        for i in range(0, len(matches), batch_size):
            batch = matches[i : i + batch_size]

            # Batch embedding creation
            descriptions = [match["description"] for match in batch]
            response = await self.openai.embeddings.create(
                model="text-embedding-3-small",
                input=descriptions,
            )
            vectors = [item.embedding for item in response.data]

            # Prepare vectors for Pinecone with flattened metadata
            to_upsert = []
            for match, vector in zip(batch, vectors):
                vector_id = str(
                    uuid.uuid5(uuid.NAMESPACE_DNS, f"tennis-match-{match['match_id']}")
                )

                # Flatten the players data
                winner = match["players"]["winner"]
                loser = match["players"]["loser"]

                # Create flattened metadata
                metadata = {
                    "match_id": match["match_id"],
                    "description": match["description"],
                    "tournament_name": match["tournament"]["name"],
                    "tournament_level": match["tournament"]["level"],
                    "surface": match["tournament"]["surface"],
                    "winner_name": winner["name"],
                    "winner_id": winner["id"],
                    "loser_name": loser["name"],
                    "loser_id": loser["id"],
                    "score": match["score"],
                    "round": match["round"],
                    # Convert stats to strings or numbers
                    "winner_aces": match["stats"].get("winner_aces", 0),
                    "winner_df": match["stats"].get("winner_df", 0),
                    "loser_aces": match["stats"].get("loser_aces", 0),
                    "loser_df": match["stats"].get("loser_df", 0),
                }

                to_upsert.append(
                    {
                        "id": vector_id,
                        "values": vector,
                        "metadata": metadata,
                    }
                )

            # Upsert to Pinecone
            self.index.upsert(vectors=to_upsert)

    def _parse_query(self, query: str) -> Dict[str, str | List[str]]:
        """Extract structured information from natural language query."""
        query = query.lower().strip()
        parsed = {}
        logger.info(f"Parsing query: {query}")

        # Extract all years - match full 4-digit years without capture groups
        year_pattern = r"\b(?:19|20)\d{2}\b"
        full_years = re.findall(year_pattern, query)
        if full_years:
            parsed["years"] = full_years
            logger.info(f"Extracted years: {parsed['years']}")

        # Extract tournament
        tournaments = {
            "australian open": "Australian Open",
            "french open": "Roland Garros",
            "roland garros": "Roland Garros",
            "wimbledon": "Wimbledon",
            "us open": "US Open",
        }
        for key, value in tournaments.items():
            if key in query:
                parsed["tournament"] = value
                logger.info(f"Found tournament: {value}")
                break

        # Extract round using regex with word boundaries
        # Order matters - check longer patterns first
        round_patterns = [
            (r"\b(quarter[- ]?finals?|quarter[- ]?final)\b", "QF"),
            (r"\b(semi[- ]?finals?|semi[- ]?final)\b", "SF"),
            (r"\b(finals?)\b", "F"),  # Only match 'final' if not part of quarter/semi
            (r"\b(fourth[- ]?rounds?|round[- ]?of[- ]?16|r16)\b", "R16"),
            (r"\b(third[- ]?rounds?|round[- ]?of[- ]?32|r32)\b", "R32"),
            (r"\b(second[- ]?rounds?|round[- ]?of[- ]?64|r64)\b", "R64"),
            (r"\b(first[- ]?rounds?|round[- ]?of[- ]?128|r128)\b", "R128"),
        ]

        # First try to find explicit round mentions
        round_found = False
        for pattern, round_code in round_patterns:
            if re.search(pattern, query):
                parsed["round"] = round_code
                round_found = True
                logger.info(
                    f"Found explicit round through regex: {pattern} -> {round_code}"
                )
                break

        # If no explicit round is mentioned, check if query is about winners/champions
        if not round_found:
            winner_patterns = [
                r"\bwon\b",
                r"\bwinner\b",
                r"\bchampion\b",
                r"\btitle\b",
                r"\bcrown\b",
                r"\btriumph\b",
            ]
            if any(re.search(pattern, query) for pattern in winner_patterns):
                parsed["round"] = "F"
                logger.info(
                    "No explicit round found, but query is about winners - defaulting to Finals"
                )

        logger.info(f"Final parsed query: {parsed}")
        return parsed

    async def search_matches(
        self, query: str, limit: int = 5
    ) -> tuple[List[Dict], Dict]:
        """Enhanced search with field filtering and semantic ranking."""
        logger.info(f"\nSearching for: {query}")

        # Step 1: Parse query for specific fields
        parsed = self._parse_query(query)
        logger.info(f"Parsed query parameters: {parsed}")

        # Step 2: Build Pinecone filter
        filter_conditions = {}
        if "tournament" in parsed:
            filter_conditions["tournament_name"] = {"$eq": parsed["tournament"]}
        if "round" in parsed:
            filter_conditions["round"] = {"$eq": parsed["round"]}
            logger.info(f"Adding round filter: {parsed['round']}")

        logger.info(f"Filter conditions: {filter_conditions}")

        # Step 3: Get vector for semantic search
        response = await self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=query,
        )
        query_vector = response.data[0].embedding

        all_matches = []

        # If we have multiple years, search for each year
        if "years" in parsed and parsed["years"]:
            for year in parsed["years"]:
                logger.info(f"Searching for year: {year}")
                # Get results without year filter first
                results = self.index.query(
                    vector=query_vector,
                    top_k=100,  # Get more results to filter
                    include_metadata=True,
                    filter=filter_conditions if filter_conditions else None,
                )

                # Filter matches for the specific year using the match_id format
                year_matches = [
                    match
                    for match in results.matches
                    if match.metadata["match_id"].startswith(
                        year
                    )  # Match IDs start with the year
                ]
                logger.info(f"Found {len(year_matches)} matches for year {year}")
                all_matches.extend(year_matches)
        else:
            # Regular search without year filter
            results = self.index.query(
                vector=query_vector,
                top_k=limit,
                include_metadata=True,
                filter=filter_conditions if filter_conditions else None,
            )
            all_matches = results.matches

        logger.info(f"Found {len(all_matches)} total matches")

        # Process matches and create analysis
        matches = []
        tournament_wins = {}
        surface_wins = {}
        head_to_head = {}

        for match in all_matches:
            match_data = match.metadata
            match_data["similarity"] = match.score

            # Rest of the processing remains the same...
            winner = match_data["winner_name"]
            loser = match_data["loser_name"]
            tournament = match_data["tournament_name"]
            surface = match_data["surface"]
            date = match_data.get("tournament", {}).get("date", "")

            # Add to matches list
            matches.append(match_data)

            # Update statistics
            tournament_wins.setdefault(winner, {}).setdefault(tournament, [])
            tournament_wins[winner][tournament].append(
                {"year": date[:4], "opponent": loser}
            )

            surface_wins.setdefault(winner, {}).setdefault(surface, [])
            surface_wins[winner][surface].append(
                {"opponent": loser, "tournament": tournament}
            )

            players = sorted([winner, loser])
            h2h_key = f"{players[0]} vs {players[1]}"
            head_to_head.setdefault(h2h_key, []).append(
                {
                    "winner": winner,
                    "loser": loser,
                    "tournament": tournament,
                    "date": date,
                    "surface": surface,
                }
            )

        analysis = {
            "tournament_wins": tournament_wins,
            "surface_wins": surface_wins,
            "head_to_head": head_to_head,
            "total_matches": len(matches),
        }

        return matches[:limit], analysis
