from pathlib import Path
import sys
import os
import logging
from datetime import datetime
from tqdm import tqdm
import pandas as pd
import subprocess
import shutil
import time
from typing import List, Dict

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.data.ingestion.atp_data_loader import ATPDataLoader
from app.data.ingestion.data_processor import ATPDataProcessor
from app.services.vector_store import TennisVectorStore


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(
            f'ingestion_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'
        ),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


def download_tennis_data(data_path: Path):
    """Download tennis data if not present"""
    if data_path.exists():
        logger.info("Tennis ATP dataset already exists")
        return

    logger.info("Downloading tennis ATP dataset...")
    try:
        # Clone the repository
        subprocess.run(
            [
                "git",
                "clone",
                "https://github.com/JeffSackmann/tennis_atp.git",
                str(data_path),
            ],
            check=True,
        )
        logger.info("Dataset downloaded successfully")
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to download dataset: {e}")
        raise


def print_dataset_stats(df: pd.DataFrame):
    """Print interesting statistics about the dataset"""
    logger.info("\n=== Dataset Statistics ===")
    logger.info(f"Total matches: {len(df):,}")
    logger.info(f"Date range: {df['tourney_date'].min()} to {df['tourney_date'].max()}")
    logger.info(f"Unique tournaments: {df['tourney_name'].nunique():,}")
    logger.info(
        f"Unique players: {len(set(df['winner_name'].unique()) | set(df['loser_name'].unique())):,}"
    )

    # Surface distribution
    surface_dist = df["surface"].value_counts()
    logger.info("\nSurface Distribution:")
    for surface, count in surface_dist.items():
        logger.info(f"{surface}: {count:,} matches ({count/len(df)*100:.1f}%)")

    # Tournament level distribution
    level_dist = df["tourney_level"].value_counts()
    logger.info("\nTournament Level Distribution:")
    for level, count in level_dist.items():
        logger.info(f"{level}: {count:,} matches ({count/len(df)*100:.1f}%)")


async def load_tennis_data() -> List[Dict]:
    """Load and process ALL tennis match data"""
    # Read all ATP match files
    dfs = []
    data_path = Path("tennis_atp")

    # Add debug logging
    logger.info("Starting to read ATP match files...")

    for file in sorted(data_path.glob("atp_matches_????.csv")):
        logger.info(f"Reading {file.name}...")
        df = pd.read_csv(file)
        # Debug: Print sample data
        if len(dfs) == 0:  # First file
            logger.info("Sample row from first file:")
            logger.info(
                df.iloc[0][
                    ["tourney_date", "tourney_name", "winner_name", "round"]
                ].to_dict()
            )
        dfs.append(df)

    # Combine all data
    df = pd.concat(dfs, ignore_index=True)
    logger.info(f"Total matches found: {len(df):,}")

    # Print dataset statistics before processing
    print_dataset_stats(df)

    # Basic cleaning and handling NaN values
    required_columns = [
        "winner_name",
        "loser_name",
        "score",
        "tourney_name",
        "surface",
        "round",
        "tourney_level",
    ]
    df = df.dropna(subset=required_columns)

    # Replace NaN with None in optional columns
    optional_columns = [
        "winner_rank",
        "loser_rank",
        "winner_aces",
        "winner_df",
        "winner_svpt",
        "winner_1stIn",
        "winner_1stWon",
        "winner_2ndWon",
        "winner_SvGms",
        "winner_bpSaved",
        "winner_bpFaced",
        "loser_aces",
        "loser_df",
        "loser_svpt",
        "loser_1stIn",
        "loser_1stWon",
        "loser_2ndWon",
        "loser_SvGms",
        "loser_bpSaved",
        "loser_bpFaced",
    ]

    for col in optional_columns:
        if col in df.columns:
            df[col] = df[col].where(pd.notna(df[col]), None)

    logger.info(f"Matches after cleaning: {len(df):,}")

    matches = []
    for _, row in tqdm(df.iterrows(), total=len(df), desc="Processing matches"):
        # Skip if any required field is missing
        if any(pd.isna(row[col]) for col in required_columns):
            continue

        # Create a detailed description for better semantic search
        description = f"""
        {row['winner_name']} defeated {row['loser_name']} 
        in the {row['round']} of {row['tourney_name']} {row['tourney_date']} 
        on {row['surface']} courts with a score of {row['score']}.
        Tournament level: {row['tourney_level']}.
        """
        if pd.notna(row.get("winner_aces")):
            description += f" {row['winner_name']} served {row['winner_aces']} aces."

        # Create match data with clean values
        match = {
            "match_id": f"{row['tourney_id']}_{row.get('match_num', 0)}",
            "description": description.strip(),
            "tournament": {
                "name": str(row["tourney_name"]),
                "date": str(row["tourney_date"]),
                "level": str(row["tourney_level"]),
                "surface": str(row["surface"]),
            },
            "players": {
                "winner": {
                    "name": str(row["winner_name"]),
                    "id": (
                        str(row["winner_id"])
                        if pd.notna(row.get("winner_id"))
                        else None
                    ),
                    "rank": (
                        int(row["winner_rank"])
                        if pd.notna(row.get("winner_rank"))
                        else None
                    ),
                },
                "loser": {
                    "name": str(row["loser_name"]),
                    "id": (
                        str(row["loser_id"]) if pd.notna(row.get("loser_id")) else None
                    ),
                    "rank": (
                        int(row["loser_rank"])
                        if pd.notna(row.get("loser_rank"))
                        else None
                    ),
                },
            },
            "score": str(row["score"]),
            "round": str(row["round"]),
            "stats": {
                col: float(row[col]) if pd.notna(row.get(col)) else None
                for col in [
                    "winner_aces",
                    "winner_df",
                    "winner_svpt",
                    "winner_1stIn",
                    "winner_1stWon",
                    "winner_2ndWon",
                    "winner_SvGms",
                    "winner_bpSaved",
                    "winner_bpFaced",
                    "loser_aces",
                    "loser_df",
                    "loser_svpt",
                    "loser_1stIn",
                    "loser_1stWon",
                    "loser_2ndWon",
                    "loser_SvGms",
                    "loser_bpSaved",
                    "loser_bpFaced",
                ]
                if col in row
            },
        }
        matches.append(match)

    return matches


async def main():
    try:
        logger.info("Starting tennis data ingestion process...")

        # Initialize components
        data_path = Path("./tennis_atp")
        download_tennis_data(data_path)

        # Load ALL matches
        logger.info("Loading ATP match data...")
        matches = await load_tennis_data()  # This function already loads all matches

        logger.info(f"Processed {len(matches):,} matches")

        # Store matches with progress bar
        logger.info("\nStoring matches in vector database...")
        batch_size = 100
        vector_store = TennisVectorStore()

        with tqdm(total=len(matches), desc="Storing matches") as pbar:
            for i in range(0, len(matches), batch_size):
                batch = matches[i : i + batch_size]
                await vector_store.store_matches(batch)
                pbar.update(len(batch))

        logger.info("\n=== Ingestion Summary ===")
        logger.info(f"Total matches ingested: {len(matches):,}")
        logger.info("Ingestion completed successfully!")

    except Exception as e:
        logger.error(f"Error during ingestion: {str(e)}", exc_info=True)
        raise


if __name__ == "__main__":
    import asyncio

    # Print ASCII art banner
    print(
        """
╔════════════════════════════════════════════════════════════╗
║                     TennisTorch Ingestion                  ║
║            Loading ATP Tennis Match Data into RAG          ║
╚════════════════════════════════════════════════════════════╝
    """
    )

    asyncio.run(main())
