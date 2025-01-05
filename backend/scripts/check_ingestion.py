import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from app.services.vector_store import TennisVectorStore


async def check_collection():
    vector_store = TennisVectorStore()

    try:
        # Check if collection exists
        collections = vector_store.client.get_collections()
        print("\nAvailable Collections:")
        for collection in collections.collections:
            print(f"- {collection.name}")

        # Get collection stats using scroll
        points = vector_store.client.scroll(
            collection_name="tennis_matches",
            limit=5,
            with_payload=True,
            with_vectors=False,
        )[0]

        if not points:
            print("\nNo points found in collection. Run ingestion first.")
            return

        print(f"\nFound {len(points)} sample points")
        print("\nSample Matches:")
        for i, point in enumerate(points, 1):
            print(f"\n{i}. Match Details:")
            print(f"ID: {point.id}")
            print(f"Tournament: {point.payload['tournament']['name']}")
            print(f"Date: {point.payload['tournament']['date']}")
            print(f"Surface: {point.payload['tournament']['surface']}")
            print(f"Round: {point.payload['round']}")
            print(f"Description: {point.payload['description']}")

        # Try a test search
        print("\nTrying a test search...")
        test_query = "Who won Wimbledon?"
        results = await vector_store.search_matches(test_query, limit=2)
        print(f"\nFound {len(results)} matches for test query: '{test_query}'")

    except Exception as e:
        print(f"\nError: {str(e)}")
        print("\nTry running ingestion first:")
        print("python -m backend.scripts.ingest_atp_data")


if __name__ == "__main__":
    print(
        """
╔════════════════════════════════════════════════════════════╗
║                 TennisTorch Data Check                     ║
║            Checking Vector Database Status                 ║
╚════════════════════════════════════════════════════════════╝
    """
    )
    asyncio.run(check_collection())
