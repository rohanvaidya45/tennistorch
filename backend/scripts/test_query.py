import asyncio
import sys
from pathlib import Path
import os

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.vector_store import TennisVectorStore
from app.services.chat_service import TennisChatService
import json
from rich import print
from rich.prompt import Prompt
from app.services.rag_service import RAGService
from app.services.chat_service import ChatService


async def interactive_query():
    vector_store = TennisVectorStore()
    chat_service = TennisChatService()

    print("[bold green]Welcome to TennisTorch Query![/bold green]")
    print(
        "Ask any tennis-related question about matches, players, tournaments, or statistics."
    )
    print("Examples:")
    print(" • Who has the best record at Roland Garros?")
    print(" • How do top players perform on different surfaces?")
    print(" • What's the head-to-head record between Federer and Nadal?")
    print(" • Who dominated the Australian Open in the 2010s?")
    print("\nType 'exit' to quit.")

    while True:
        query = Prompt.ask("\n[bold blue]Enter your query[/bold blue]")

        if query.lower() == "exit":
            print("[bold red]Goodbye![/bold red]")
            break

        print("\n[bold green]Analyzing...[/bold green]")

        # Get matches from vector store
        matches, analysis = await vector_store.search_matches(query, limit=10)

        # Debug print
        print(f"\n[bold]Debug: Found {len(matches)} matches[/bold]")

        if matches:
            print("\n[bold yellow]Top Relevant Matches:[/bold yellow]")
            for i, match in enumerate(matches[:3], 1):
                print(f"\n[bold]{i}.[/bold] {match['description']}")
                print(f"   Match ID: {match['match_id']}")
                print(
                    f"   Tournament: {match['tournament_name']} ({match['tournament_level']})"
                )
                print(f"   Surface: {match['surface']}")
                print(f"   Round: {match['round']}")
                print(f"   Winner: {match['winner_name']}")
                print(f"   Score: {match['score']}")
                print(f"   Similarity: {match['similarity']:.3f}")

        # Get AI analysis after showing matches
        response = await chat_service.analyze_query(query, matches, analysis)
        print("\n[bold green]Analysis:[/bold green]")
        print(response)


def test_multiple_years():
    chat_service = ChatService()
    query = "Who won Wimbledon in 2018 and 2019?"
    response = chat_service.generate_response(query)
    print(f"Query: {query}")
    print(f"Response: {response}")


if __name__ == "__main__":
    print(
        """
╔════════════════════════════════════════════════════════════╗
║                 TennisTorch Query Test                     ║
║              Interactive Tennis Questions                  ║
╚════════════════════════════════════════════════════════════╝
    """
    )

    asyncio.run(interactive_query())
    test_multiple_years()
