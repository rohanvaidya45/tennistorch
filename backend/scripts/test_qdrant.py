import asyncio
from qdrant_client import QdrantClient
import json
from pathlib import Path
import time


async def test_qdrant():
    # Connect to Qdrant using HTTP port (6333) instead of gRPC port
    client = QdrantClient(host="localhost", port=6333)

    # Wait a bit for Qdrant to be ready
    print("Waiting for Qdrant to be ready...")
    time.sleep(5)

    try:
        # 1. Check collections
        print("\n=== Collections ===")
        collections = client.get_collections()
        print(f"Found collections: {[c.name for c in collections.collections]}")

        # 2. Get collection info
        print("\n=== Collection Info ===")
        try:
            collection = client.get_collection("tennis_matches")
            print(f"Name: tennis_matches")
            print(f"Vectors config: {collection.config.params.vectors}")
        except Exception as e:
            print(f"Error getting collection info: {e}")
            return

        # 3. Count points
        print("\n=== Points Count ===")
        count = client.count(collection_name="tennis_matches")
        print(f"Total points: {count.count}")

        # 4. Get sample points
        print("\n=== Sample Points ===")
        points = client.scroll(
            collection_name="tennis_matches",
            limit=2,
            with_payload=True,
            with_vectors=False,  # Don't need vectors for inspection
        )[0]

        for i, point in enumerate(points, 1):
            print(f"\nPoint {i}:")
            print(f"ID: {point.id}")
            print("\nPayload:")
            print(json.dumps(point.payload, indent=2))

        # 5. Try a test search
        print("\n=== Test Search ===")
        results = client.search(
            collection_name="tennis_matches",
            query_vector=[0.0] * 1536,  # Dummy vector
            limit=1,
        )
        print(f"Search returned {len(results)} results")

    except Exception as e:
        print(f"\nError: {str(e)}")
        print("\nDebug info:")
        print("1. Check if Qdrant is running:")
        print("   docker ps | grep qdrant")
        print("2. Check Qdrant logs:")
        print("   docker logs qdrant")
        print("3. Check storage directory:")
        print("   ls -la ./qdrant_storage")


if __name__ == "__main__":
    print(
        """
╔════════════════════════════════════════════════════════════╗
║                 TennisTorch Qdrant Test                    ║
║            Checking Vector Database Details                ║
╚════════════════════════════════════════════════════════════╝
    """
    )

    asyncio.run(test_qdrant())
