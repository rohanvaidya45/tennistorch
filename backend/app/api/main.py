from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ..services.rag_service import TennisRAGService
import logging
import os
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://tennistorch.vercel.app",
        "https://*.vercel.app",  # Allow all Vercel deployments during development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
    sources: list
    confidence_score: float


@app.post("/api/query")
async def query_tennis(request: QueryRequest) -> QueryResponse:
    try:
        rag_service = TennisRAGService()
        response = await rag_service.answer_query(request.question)
        return QueryResponse(**response)
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
