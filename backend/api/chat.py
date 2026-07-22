import uuid
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from backend.api.auth_middleware import get_current_user
from backend.graph.main_graph import build_main_graph

router = APIRouter()
graph = build_main_graph()

class ChatRequest(BaseModel):
    message: str
    session_id: str = None
    stream: bool = False

@router.post("/chat")
async def chat(request: ChatRequest, user_id: str = Depends(get_current_user)):
    session_id = request.session_id or str(uuid.uuid4())
    
    initial_state = {
        "user_id": user_id,
        "session_id": session_id,
        "user_message": request.message,
    }
    
    result_state = await graph.ainvoke(initial_state)
    
    return {
        "response": result_state.get("response_text", "Error processing request."),
        "charts": result_state.get("response_charts", []),
        "tables": result_state.get("response_tables", []),
        "session_id": session_id,
        "agent_used": result_state.get("selected_agent", "unknown")
    }
