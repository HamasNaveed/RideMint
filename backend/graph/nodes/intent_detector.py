import os
import json
from backend.graph.state import RideMintState, QueryIntent
from backend.agents.base_agent import get_agent_llm

async def detect_intent_node(state: RideMintState) -> RideMintState:
    llm = get_agent_llm(temperature=0.1)
    
    prompt = f"""
You are an intent classifier for RideMint, a ride-hailing driver analytics app.
Currency: PKR. 

Classify this message into one category:
- financial_query: earnings, expenses, profit, revenue questions
- operational_query: km driven, fuel efficiency, distance questions  
- recommendation: advice, tips, how to improve
- report_request: formal report generation
- forecast_request: future predictions
- anomaly_detection: unusual patterns, spikes, drops
- general_question: greetings, unclear

Extract:
- time_period: "this_month" | "last_month" | "last_week" | "YYYY-MM" | "all_time" | null
- entities: relevant terms
- confidence: 0.0-1.0

Message: {state['user_message']}

Respond ONLY in valid JSON with keys: category, confidence, time_period, entities.
"""
    
    try:
        res = await llm.ainvoke(prompt)
        content = res.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        intent_data = json.loads(content.strip())
    except Exception:
        intent_data = {
            "category": "financial_query",
            "confidence": 0.8,
            "time_period": "this_month",
            "entities": []
        }
        
    state["intent"] = QueryIntent(**intent_data)
    return state

