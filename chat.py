from fastapi import APIRouter
from app.schemas import ChatRequest, ChatResponse
from app.agent.graph import run_agent

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Chat endpoint — sends user message to LangGraph agent.
    Agent uses Groq LLM to extract info and execute appropriate tool.
    """
    result = await run_agent(request.message)
    return ChatResponse(
        response=result["response"],
        extracted_data=result.get("extracted_data"),
        action_taken=result.get("action_taken"),
        interaction_id=result.get("interaction_id")
    )
