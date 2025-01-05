from typing import Dict, Any, List
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()


class LLMService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate_response(self, prompt: str) -> str:
        response = await self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a tennis expert and historian."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )
        return response.choices[0].message.content

    def _create_prompt(self, question: str, context_texts: List[str]) -> str:
        context_str = "\n".join(context_texts)
        return f"""Using the following context information, please answer the question.
        
Context:
{context_str}

Question: {question}

Please provide a clear, accurate answer based on the context provided."""
