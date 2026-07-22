import operator
from typing import TypedDict, Optional, Annotated, Literal, List, Dict, Any
from langgraph.graph.message import add_messages

class QueryIntent(TypedDict):
    category: Literal[
        "financial_query", "operational_query", "recommendation",
        "report_request", "forecast_request", "anomaly_detection", "general_question"
    ]
    confidence: float
    time_period: Optional[str]
    entities: List[str]

class RideMintState(TypedDict):
    user_id: str
    session_id: str
    user_message: str
    
    intent: Optional[QueryIntent]
    selected_agent: Optional[str]
    tool_calls: List[Dict[str, Any]]
    retrieved_docs: List[str]
    sql_results: List[Dict[str, Any]]
    computed_kpis: Dict[str, Any]
    
    conversation_history: Annotated[list, add_messages]
    business_context: Dict[str, Any]
    
    response_text: str
    response_charts: List[Dict[str, Any]]
    response_tables: List[Dict[str, Any]]
    citations: List[str]
    error: Optional[str]
