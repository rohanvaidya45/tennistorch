import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from app.services.rag_service import TennisRAGService


async def test_queries():
    rag = TennisRAGService()

    test_questions = [
        "Who won Wimbledon in 2019?",
        "What was Nadal's best surface in 2020?",
        "List some notable matches between Federer and Djokovic",
        "Who had the most aces in 2018?",
    ]

    for question in test_questions:
        print(f"\nQuestion: {question}")
        try:
            response = await rag.answer_query(question)
            print(f"\nAnswer: {response['answer']}")
            print(f"\nConfidence: {response['confidence_score']:.2f}")
            print("\nSources:")
            for source in response["sources"][:2]:  # Show top 2 sources
                print(f"- {source['description']}")
        except Exception as e:
            print(f"Error: {str(e)}")
        print("\n" + "=" * 80)


if __name__ == "__main__":
    asyncio.run(test_queries())
