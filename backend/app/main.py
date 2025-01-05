from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.vector_store import TennisVectorStore
from app.services.chat_service import TennisChatService
import logging
import os
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",  # Allow all Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


@app.post("/api/query")
async def query_tennis(request: QueryRequest):
    try:
        logger.info(f"Received query: {request.query}")

        vector_store = TennisVectorStore()
        chat_service = TennisChatService()

        # Get matches from vector store
        matches, analysis = await vector_store.search_matches(request.query, limit=10)
        logger.info(f"Found {len(matches)} matches")

        # Get AI analysis
        response = await chat_service.analyze_query(request.query, matches, analysis)
        logger.info("Generated response")

        return {"matches": matches, "analysis": analysis, "response": response}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Load environment variables
load_dotenv()
