from openai import AsyncOpenAI
from typing import Dict, List
import json


class TennisChatService:
    def __init__(self):
        self.openai = AsyncOpenAI()

    def _classify_query(self, query: str) -> str:
        """Classify the type of tennis query."""
        query = query.lower()

        if any(
            word in query
            for word in ["stats", "statistics", "average", "most", "least"]
        ):
            return "statistical"
        elif any(word in query for word in ["head to head", "versus", "vs", "against"]):
            return "head_to_head"
        elif any(
            tournament in query
            for tournament in [
                "french open",
                "roland garros",
                "wimbledon",
                "us open",
                "australian open",
            ]
        ):
            return "tournament"
        elif any(surface in query for surface in ["clay", "grass", "hard"]):
            return "surface"
        else:
            return "general"

    async def analyze_query(
        self, query: str, matches: List[Dict], analysis: Dict
    ) -> str:
        system_prompt = """You are a tennis expert providing accurate, engaging answers to tennis queries.

IMPORTANT CITATION RULES:
1. ALWAYS include a citation [n] immediately after mentioning ANY match score
2. ALWAYS include a citation [n] when mentioning specific match results (winner/loser)
3. Citations must be placed right after the relevant fact, not at the end of sentences

Examples of correct citation usage:
✓ "Djokovic won 6-4, 7-6, 6-3 [1] against Medvedev"
✓ "The match ended 7-6, 6-4 [2] in favor of Nadal"
✓ "Federer defeated Roddick [3] in a close match"

For specific match/tournament queries (e.g., "Who won US Open 2016?"):
- Give the exact result with score and details
- Include any notable context about the match/tournament
- Use citations [1] for all match facts

For queries asking about multiple items (e.g., "Who won Wimbledon in 2015, 2016, and 2018?"):
- Number each part of the response (1., 2., 3., etc.)
- Present each answer on a new line
- Include relevant citations for each part
- Keep the format consistent across all parts

Example multi-part response:
1. In 2015, Novak Djokovic defeated Roger Federer 7-6(1), 6-7(10), 6-4, 6-3 [1].

2. Andy Murray claimed the 2016 title, beating Milos Raonic 6-4, 7-6(3), 7-6(2) [2].

3. The 2018 championship went to Novak Djokovic who defeated Kevin Anderson 6-2, 6-2, 7-6(3) [3].

For general/statistical queries:
- Provide direct, authoritative answers
- Include relevant statistics and achievements
- Focus on historical facts and records
- Don't reference or qualify the data source"""

        user_message = f"""Query: {query}

Available match data and statistics:
{json.dumps(matches, indent=2)}  # Only send relevant matches

Additional statistics:
{json.dumps(analysis, indent=2)}

Provide a response with proper citations and numbered format for multi-part answers."""

        response = await self.openai.chat.completions.create(
            model="gpt-4-1106-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0,
            max_tokens=500,
        )

        return response.choices[0].message.content

    def generate_response(self, query: str) -> str:
        """Generate response using RAG and LLM."""
        relevant_docs = self.rag_service.process_query(query)

        if not relevant_docs:
            return "I couldn't find any relevant information about that."

        # Combine context from all relevant documents
        context = "\n\n".join([doc.page_content for doc in relevant_docs])

        prompt = f"""Based on the following context, answer the user's question: {query}
        
        Context:
        {context}
        
        If the question asks about multiple years, please include information for all years mentioned.
        
        Answer:"""

        return self.llm_service.generate_response(prompt)
