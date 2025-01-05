import json
from typing import List, Dict
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()


class DataIngestion:
    def __init__(self):
        self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
        self.vector_store = QdrantClient(
            host=os.getenv("QDRANT_HOST", "localhost"),
            port=int(os.getenv("QDRANT_PORT", 6333)),
        )
        self.collection_name = "tennis_knowledge"

    async def ingest_data(self, data_path: str):
        # Load tennis knowledge from JSON file
        with open(data_path, "r") as f:
            tennis_data = json.load(f)

        # Create embeddings and store in vector database
        for item in tennis_data:
            vector = self.encoder.encode(item["text"]).tolist()

            self.vector_store.upsert(
                collection_name=self.collection_name,
                points=[
                    {
                        "id": item["id"],
                        "vector": vector,
                        "payload": {
                            "text": item["text"],
                            "title": item["title"],
                            "url": item.get("url", ""),
                            "category": item.get("category", "general"),
                        },
                    }
                ],
            )
