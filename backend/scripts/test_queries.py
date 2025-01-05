import asyncio
import sys
from pathlib import Path
import logging
from datetime import datetime

sys.path.append(str(Path(__file__).parent.parent))

from app.services.rag_service import TennisRAGService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(message)s",
    handlers=[
        # File handler - save to a file
        logging.FileHandler(
            f'query_debug_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'
        ),
        # Stream handler - print to console
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)


async def interactive_test():
    rag = TennisRAGService()

    # Some example questions to try
    print("\nExample questions you can ask:")
    print("1. Who won Wimbledon in 2019?")
    print("2. What was Nadal's record in Grand Slam finals between 2010-2015?")
    print("3. List some notable matches between Federer and Djokovic at the US Open")
    print("4. Who had the most success at Masters tournaments in 2018?")
    print("\nType 'exit' to quit")

    while True:
        print("\nEnter your question: ", end="")
        question = input()

        if question.lower() == "exit":
            break

        try:
            logger.info(f"\n\n=== New Query: {question} ===\n")
            response = await rag.answer_query(question)

            print("\nAnswer:", response["answer"])
            print("\nSources:")
            for i, source in enumerate(response["sources"][:3], 1):
                print(f"\n{i}. {source['description']}")
            print(f"\nConfidence Score: {response['confidence_score']:.2f}")

        except Exception as e:
            logger.error(f"Error: {str(e)}", exc_info=True)

        print("\n" + "=" * 80)


if __name__ == "__main__":
    print(
        """
╔════════════════════════════════════════════════════════════╗
║                     TennisTorch Testing                    ║
║              Interactive Tennis Query System               ║
╚════════════════════════════════════════════════════════════╝
    """
    )

    asyncio.run(interactive_test())
