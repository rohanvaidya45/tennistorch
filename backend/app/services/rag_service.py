from typing import Dict, List, Tuple
from .vector_store import TennisVectorStore
from openai import AsyncOpenAI
from langchain.schema import Document
import logging
import json
import re

logger = logging.getLogger(__name__)


class TennisRAGService:
    def __init__(self):
        self.vector_store = TennisVectorStore()
        self.llm = AsyncOpenAI()

    async def answer_query(self, question: str) -> Dict:
        """Answer tennis questions using RAG"""
        # Get relevant matches
        matches = await self.vector_store.search_matches(question)

        # Log retrieved matches
        logger.info("\n=== Retrieved Matches ===")
        for i, match in enumerate(matches[:3], 1):
            logger.info(f"\nMatch {i} (Similarity: {match['similarity']:.3f}):")
            logger.info(f"Description: {match['description']}")
            logger.info(
                f"Tournament: {match['tournament']['name']} ({match['tournament']['date']})"
            )
            logger.info(f"Surface: {match['tournament']['surface']}")
            logger.info(f"Round: {match['round']}")

        # Create context from matches
        context = self._format_context(matches)

        # Generate response using GPT-4
        prompt = self._create_prompt(question, context)

        # Log the full prompt
        logger.info("\n=== Full Prompt to OpenAI ===")
        logger.info(prompt)

        chat_completion = await self.llm.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": """You are a tennis expert and historian. Provide detailed, analytical responses 
                    about tennis matches, focusing on key moments, statistics, and historical context. When discussing 
                    matches, highlight significant achievements, head-to-head records, and tournament importance.""",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        # Log the response
        logger.info("\n=== OpenAI Response ===")
        logger.info(chat_completion.choices[0].message.content)

        return {
            "answer": chat_completion.choices[0].message.content,
            "sources": matches[:3],  # Return top 3 most relevant matches
            "confidence_score": (
                sum(m["similarity"] for m in matches) / len(matches) if matches else 0
            ),
        }

    def _format_context(self, matches: List[Dict]) -> str:
        """Format matches into context string"""
        context = []
        for match in matches:
            match_info = (
                f"Match: {match['description']}\n"
                f"Tournament: {match['tournament']['name']} ({match['tournament']['date']})\n"
                f"Surface: {match['tournament']['surface']}\n"
                f"Round: {match['round']}\n"
            )

            if match["stats"]:
                stats = "\nStatistics:\n"
                for stat, value in match["stats"].items():
                    stats += f"- {stat}: {value}\n"
                match_info += stats

            context.append(match_info)

        return "\n---\n".join(context)

    def _create_prompt(self, question: str, context: str) -> str:
        return f"""Based on the following tennis match information, please answer this question: "{question}"

Context:
{context}

Please provide a comprehensive answer that:
1. Directly addresses the question
2. Includes relevant statistics when available
3. Provides historical context
4. Mentions any notable achievements or records
5. Explains the significance of the matches or results

If the provided match information is not sufficient to fully answer the question, please indicate what aspects you cannot address.

Question: {question}"""

    def extract_years_from_query(self, query: str) -> List[int]:
        """Extract all years mentioned in the query."""
        # Look for 4-digit numbers that could be years (between 1877-2024)
        year_pattern = r"\b(19|20)\d{2}\b"
        years = [int(year) for year in re.findall(year_pattern, query)]
        return [
            year for year in years if 1877 <= year <= 2024
        ]  # Wimbledon started in 1877

    def process_query(self, query: str) -> List[Document]:
        """Process query and return relevant documents."""
        years = self.extract_years_from_query(query)

        if not years:
            # If no years found, proceed with regular semantic search
            return self.vector_store.similarity_search(query, k=self.num_results)

        # For multiple years, gather documents for each year
        all_relevant_docs = []
        for year in years:
            year_query = f"{query} {year}"
            # Add metadata filter for the specific year
            filter_dict = {"year": str(year)}
            docs = self.vector_store.similarity_search(
                year_query, k=self.num_results, filter=filter_dict
            )
            all_relevant_docs.extend(docs)

        return all_relevant_docs[: self.num_results]

    def process_citations(
        self, text: str, source_documents: List[Document]
    ) -> Tuple[str, List[Dict]]:
        citations = []
        current_count = 1
        processed_text = text

        # First collect all match patterns and their details
        match_patterns = []
        for doc in source_documents:
            winner = doc.metadata.get("winner")
            loser = doc.metadata.get("runner_up")
            score = doc.metadata.get("score")

            # Look for different possible patterns in the text
            patterns = [
                f"{winner} defeated {loser} {score}",
                f"{winner} beat {loser} {score}",
                f"{winner} won against {loser} {score}",
                f"{winner} def. {loser} {score}",
                # Add the pattern without score
                f"{winner} defeated {loser}",
                f"{winner} beat {loser}",
            ]

            match_details = {
                "id": current_count,
                "winner": winner,
                "loser": loser,
                "score": score,
                "date": doc.metadata.get("date"),
                "tournament": doc.metadata.get("tournament"),
            }

            # Find and replace the first matching pattern
            pattern_found = False
            for pattern in patterns:
                if pattern in processed_text:
                    citation_marker = f"{pattern} [{current_count}]"
                    processed_text = processed_text.replace(pattern, citation_marker, 1)
                    citations.append(match_details)
                    pattern_found = True
                    break

            if pattern_found:
                current_count += 1

        return processed_text, citations
