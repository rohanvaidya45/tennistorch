from qdrant_client import QdrantClient
from qdrant_client.http import models
import os
from dotenv import load_dotenv

load_dotenv()


def create_tennis_collection():
    client = QdrantClient(
        host=os.getenv("QDRANT_HOST", "localhost"),
        port=int(os.getenv("QDRANT_PORT", 6333)),
    )

    # Create collection with necessary parameters
    client.recreate_collection(
        collection_name="tennis_knowledge",
        vectors_config=models.VectorParams(
            size=384,  # Dimension of all-MiniLM-L6-v2 embeddings
            distance=models.Distance.COSINE,
        ),
    )

    # Create payload indexes for efficient filtering
    client.create_payload_index(
        collection_name="tennis_knowledge",
        field_name="category",
        field_schema=models.PayloadSchemaType.KEYWORD,
    )


if __name__ == "__main__":
    create_tennis_collection()
