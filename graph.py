"""
LangGraph Agent — ReAct pattern with Groq gemma2-9b-it
Auto-selects tool based on user input
"""
import json
from typing import Annotated, TypedDict, Sequence
from langchain_core.messages import (
    BaseMessage, HumanMessage, AIMessage, ToolMessage, SystemMessage
)
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from app.config import settings
from app.agent.tools import ALL_TOOLS

SYSTEM_PROMPT = """You are an AI assistant for a Life Science CRM system.
You help Field Representatives log and manage interactions with Healthcare Professionals (HCPs).

Available tools:
1. log_interaction     - Log a new visit/interaction with a doctor
2. edit_interaction    - Edit/update an existing interaction by ID
3. search_hcp          - Search for doctors by name, hospital, or specialty
4. schedule_followup   - Schedule a follow-up meeting with an HCP
5. generate_visit_summary - Generate a visit summary report by interaction ID

Rules:
- When user mentions meeting/visiting a doctor → call log_interaction
- Extract: doctor name, hospital, specialty, products, discussion, follow-up date
- Resolve relative dates: "today", "tomorrow", "next Tuesday" automatically
- When user asks to edit/update → call edit_interaction
- When user searches for a doctor → call search_hcp
- When user asks for summary/report → call generate_visit_summary
- Always confirm what action was taken
- Be concise and professional
"""


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]


def create_agent():
    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model="llama-3.3-70b-versatile",
        temperature=0.1,
        max_tokens=2048
    )
    llm_with_tools = llm.bind_tools(ALL_TOOLS)
    tool_node = ToolNode(ALL_TOOLS)

    def call_model(state: AgentState):
        msgs = list(state["messages"])
        if not any(isinstance(m, SystemMessage) for m in msgs):
            msgs = [SystemMessage(content=SYSTEM_PROMPT)] + msgs
        response = llm_with_tools.invoke(msgs)
        return {"messages": [response]}

    def should_continue(state: AgentState):
        last = state["messages"][-1]
        if hasattr(last, "tool_calls") and last.tool_calls:
            return "tools"
        return END

    graph = StateGraph(AgentState)
    graph.add_node("agent", call_model)
    graph.add_node("tools", tool_node)
    graph.set_entry_point("agent")
    graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    graph.add_edge("tools", "agent")
    return graph.compile()


_agent = None

def get_agent():
    global _agent
    if _agent is None:
        _agent = create_agent()
    return _agent


async def run_agent(user_message: str) -> dict:
    agent = get_agent()
    result = agent.invoke({"messages": [HumanMessage(content=user_message)]})
    messages = result["messages"]

    ai_response = ""
    extracted_data = {}
    action_taken = None
    interaction_id = None

    for msg in reversed(messages):
        if isinstance(msg, AIMessage) and not (hasattr(msg, "tool_calls") and msg.tool_calls):
            ai_response = msg.content
            break

    for msg in messages:
        if isinstance(msg, ToolMessage):
            try:
                data = json.loads(msg.content)
                if data.get("success"):
                    action_taken = msg.name
                    if "interaction_id" in data:
                        interaction_id = data["interaction_id"]
                    extracted_data.update(data)
            except Exception:
                pass

    return {
        "response": ai_response or "Request processed successfully.",
        "extracted_data": extracted_data,
        "action_taken": action_taken,
        "interaction_id": interaction_id
    }
