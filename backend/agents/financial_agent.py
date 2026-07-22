import os
import json
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from backend.graph.state import RideMintState
from backend.agents.base_agent import BaseAgent, get_agent_llm

class FinancialAgent(BaseAgent):
    SYSTEM_PROMPT = """
You are RideMint's Financial Intelligence Agent for a ride-hailing driver in Pakistan.
Currency: PKR. 

Business Context:
{business_context}

Available SQL Data:
{sql_results}

Retrieved historical context:
{retrieved_docs}

Rules:
- Always include PKR amounts
- Show % changes when comparing periods
- Never hallucinate numbers
- Provide actionable insights
"""
    
    async def run(self, state: RideMintState) -> RideMintState:
        llm = get_agent_llm(temperature=0.2)
        
        user_id = state["user_id"]
        sql_tool = SQLTool(user_id=user_id)
        analytics_tool = AnalyticsTool(user_id=user_id)
        forecast_tool = ForecastTool(user_id=user_id)
        rag_tool = RAGTool(user_id=user_id)
        
        tools = [sql_tool, analytics_tool, forecast_tool, rag_tool]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.SYSTEM_PROMPT),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad"),
        ])
        
        agent = create_openai_functions_agent(llm, tools, prompt)
        executor = AgentExecutor(agent=agent, tools=tools, max_iterations=5, handle_parsing_errors=True)
        
        result = await executor.ainvoke({
            "input": state["user_message"],
            "business_context": json.dumps(state["business_context"]),
            "sql_results": json.dumps(state.get("sql_results", [])),
            "retrieved_docs": "\n".join(state.get("retrieved_docs", [])),
            "chat_history": state["conversation_history"][-6:] if state.get("conversation_history") else []
        })
        
        state["response_text"] = result["output"]
        return state

async def financial_agent_node(state: RideMintState) -> RideMintState:
    agent = FinancialAgent()
    return await agent.run(state)
