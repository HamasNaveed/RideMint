from langgraph.graph import StateGraph, END
from backend.graph.state import RideMintState
from backend.graph.nodes.intent_detector import detect_intent_node
from backend.graph.nodes.query_classifier import classify_and_route_node
from backend.graph.nodes.retriever import retrieve_context_node
from backend.graph.nodes.response_formatter import format_response_node

from backend.agents.financial_agent import financial_agent_node
from backend.agents.operations_agent import operations_agent_node

# Simplified versions for recommendation and reporting due to missing modules
async def recommendation_agent_node(state: RideMintState) -> RideMintState:
    state["response_text"] = "Recommendations feature is being built."
    return state
    
async def reporting_agent_node(state: RideMintState) -> RideMintState:
    state["response_text"] = "Reporting feature is being built."
    return state

def build_main_graph():
    workflow = StateGraph(RideMintState)
    
    workflow.add_node("detect_intent", detect_intent_node)
    workflow.add_node("classify_route", classify_and_route_node)
    workflow.add_node("retrieve_context", retrieve_context_node)
    workflow.add_node("run_financial_agent", financial_agent_node)
    workflow.add_node("run_operations_agent", operations_agent_node)
    workflow.add_node("run_reporting_agent", reporting_agent_node)
    workflow.add_node("run_recommendation_agent", recommendation_agent_node)
    workflow.add_node("format_response", format_response_node)
    
    workflow.set_entry_point("detect_intent")
    workflow.add_edge("detect_intent", "classify_route")
    
    def route_by_intent(state: RideMintState):
        if not state.get("intent"):
            return "general_question"
        return state["intent"]["category"]
        
    workflow.add_conditional_edges(
        "classify_route",
        route_by_intent,
        {
            "financial_query": "retrieve_context",
            "forecast_request": "retrieve_context",
            "anomaly_detection": "retrieve_context",
            "operational_query": "retrieve_context",
            "recommendation": "run_recommendation_agent",
            "report_request": "run_reporting_agent",
            "general_question": "format_response",
        }
    )
    
    def route_by_agent(state: RideMintState):
        return state.get("selected_agent", "financial")
        
    workflow.add_conditional_edges(
        "retrieve_context",
        route_by_agent,
        {
            "financial": "run_financial_agent",
            "operations": "run_operations_agent",
        }
    )
    
    for node in ["run_financial_agent", "run_operations_agent", "run_reporting_agent", "run_recommendation_agent"]:
        workflow.add_edge(node, "format_response")
        
    workflow.add_edge("format_response", END)
    
    return workflow.compile()
