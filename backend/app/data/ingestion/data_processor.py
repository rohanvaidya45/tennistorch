import pandas as pd
from typing import Dict, List
from datetime import datetime


class ATPDataProcessor:
    """Process and clean ATP tennis data for vector storage"""

    def __init__(self):
        self.surface_mapping = {
            "Hard": "hard",
            "Clay": "clay",
            "Grass": "grass",
            "Carpet": "carpet",
        }

    def process_match_data(self, df: pd.DataFrame) -> List[Dict]:
        """Process match data into format suitable for vector storage"""
        processed_matches = []

        for _, row in df.iterrows():
            match_dict = {
                "match_id": f"{row['tourney_id']}_{row['match_num']}",
                "tournament": {
                    "name": row["tourney_name"],
                    "date": str(row["tourney_date"]),  # Convert to string
                    "surface": self.surface_mapping.get(row["surface"], "unknown"),
                    "level": row["tourney_level"],
                },
                "players": {
                    "winner": {
                        "name": f"{row['winner_name']}",
                        "id": row["winner_id"],
                        "rank": (
                            row["winner_rank"] if pd.notna(row["winner_rank"]) else None
                        ),
                    },
                    "loser": {
                        "name": f"{row['loser_name']}",
                        "id": row["loser_id"],
                        "rank": (
                            row["loser_rank"] if pd.notna(row["loser_rank"]) else None
                        ),
                    },
                },
                "score": row["score"],
                "stats": self._extract_match_stats(row),
                "round": row["round"],
            }

            # Create rich text description
            match_dict["description"] = self._create_match_description(match_dict)
            processed_matches.append(match_dict)

        return processed_matches

    def _extract_match_stats(self, row: pd.Series) -> Dict:
        """Extract match statistics"""
        stats = {}
        stat_columns = [
            "w_ace",
            "w_df",
            "w_svpt",
            "w_1stIn",
            "w_1stWon",
            "w_2ndWon",
            "l_ace",
            "l_df",
            "l_svpt",
            "l_1stIn",
            "l_1stWon",
            "l_2ndWon",
        ]

        for col in stat_columns:
            if col in row and pd.notna(row[col]):
                stats[col] = row[col]

        return stats

    def _create_match_description(self, match: Dict) -> str:
        """Create natural language description of match"""
        tournament = match["tournament"]
        winner = match["players"]["winner"]
        loser = match["players"]["loser"]

        # Format date string
        date = tournament["date"]
        year = date[:4] if len(date) >= 4 else date

        description = (
            f"{winner['name']} defeated {loser['name']} "
            f"in the {match['round']} of {tournament['name']} "
            f"({year}) on {tournament['surface']} "
            f"with a score of {match['score']}. "
        )

        # Add ranking context if available
        if winner["rank"] and loser["rank"]:
            description += (
                f"At the time, {winner['name']} was ranked #{winner['rank']} "
                f"while {loser['name']} was #{loser['rank']}."
            )

        return description
