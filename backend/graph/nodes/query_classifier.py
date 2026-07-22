from backend.graph.state import RideMintState
from backend.memory.business_context import load_business_context

async def classify_and_route_node(state: RideMintState) -> RideMintState:
    if not state.get("business_context"):
        ctx = await load_business_context(state["user_id"])
        state["business_context"] = ctx
    
    cat = state["intent"]["category"]
    
    agent_map = {
        "financial_query": "financial",
        "forecast_request": "financial",
        "anomaly_detection": "financial",
        "operational_query": "operations",
        "recommendation": "recommendation",
        "report_request": "reporting",
        "general_question": "general"
    }
    
    state["selected_agent"] = agent_map.get(cat, "general")
    return state
