import os
import json
from openai import AsyncOpenAI
from backend.graph.state import RideMintState, QueryIntent

async def detect_intent_node(state: RideMintState) -> RideMintState:
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    model = os.getenv("OPENAI_MODEL_FAST", "gpt-4o-mini")
    
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
    
    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.1,
        max_tokens=200
    )
    
    intent_data = json.loads(response.choices[0].message.content)
    state["intent"] = QueryIntent(**intent_data)
    return state
