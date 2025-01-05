from pinecone import Pinecone
import os
from dotenv import load_dotenv

load_dotenv()


def check_pinecone():
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

    print("\nAvailable indexes:")
    print(pc.list_indexes())

    # Try to describe the index
    index = pc.Index("tennis")
    print("\nIndex description:")
    print(index.describe_index_stats())


if __name__ == "__main__":
    check_pinecone()
