import json
from pathlib import Path
from typing import List, Dict
import asyncio
from ..services.rag_service import RAGService


async def load_tennis_knowledge():
    # Initialize RAG service
    rag = RAGService()

    # Load JSON data
    data_path = Path(__file__).parent.parent.parent / "data" / "tennis_knowledge.json"
    with open(data_path, "r") as f:
        data = json.load(f)

    # Process each article
    for article in data["articles"]:
        try:
            vector = rag.encoder.encode(article["text"]).tolist()

            await rag.vector_store.upsert(
                collection_name="tennis_knowledge",
                points=[
                    {
                        "id": article["id"],
                        "vector": vector,
                        "payload": {
                            "text": article["text"],
                            "title": article["title"],
                            "url": article.get("url", ""),
                            "category": article.get("category", "general"),
                        },
                    }
                ],
            )
            print(f"Loaded article: {article['title']}")

        except Exception as e:
            print(f"Error loading article {article['id']}: {str(e)}")


if __name__ == "__main__":
    asyncio.run(load_tennis_knowledge())
