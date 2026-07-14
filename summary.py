from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agent.graph import run_agent

router = APIRouter(prefix="/summary", tags=["Summary"])

class SummaryRequest(BaseModel):
    interaction_id: int

@router.post("/")
async def generate_summary(request: SummaryRequest):
    """Generate AI-powered visit summary for a given interaction."""
    message = f"Generate a visit summary for interaction ID {request.interaction_id}"
    result = await run_agent(message)
    return {
        "interaction_id": request.interaction_id,
        "summary": result.get("extracted_data", {}).get("summary"),
        "response": result["response"]
    }
