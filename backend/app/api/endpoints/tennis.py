from fastapi import APIRouter, HTTPException
from app.services.vector_store import TennisVectorStore
from app.services.chat_service import TennisChatService

router = APIRouter()


@router.post("/analyze")
async def analyze_tennis_query(query: str):
    try:
        vector_store = TennisVectorStore()
        chat_service = TennisChatService()

        matches, analysis = await vector_store.search_matches(query)
        response = await chat_service.analyze_query(query, matches, analysis)

        return {
            "analysis": response,
            "matches": matches[:3],  # Top 3 relevant matches
            "metadata": {
                "total_matches": analysis["total_matches"],
                "query_type": "statistical" if "stats" in query.lower() else "match",
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
