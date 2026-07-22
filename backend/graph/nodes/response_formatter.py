from backend.graph.state import RideMintState

async def format_response_node(state: RideMintState) -> RideMintState:
    if "response_charts" not in state:
        state["response_charts"] = []
    if "response_tables" not in state:
        state["response_tables"] = []
    if "citations" not in state:
        state["citations"] = []
        
    if not state.get("response_text"):
        if state.get("error"):
            state["response_text"] = f"Error: {state['error']}"
        else:
            state["response_text"] = "I could not generate a response. Please try again."
            
    return state
