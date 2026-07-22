import os
import json
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from backend.graph.state import RideMintState
from backend.agents.base_agent import BaseAgent
from backend.tools.sql_tool import SQLTool
from backend.tools.analytics_tool import AnalyticsTool

class OperationsAgent(BaseAgent):
    SYSTEM_PROMPT = """
You are RideMint's Operations Intelligence Agent.

Business Context:
{business_context}

Rules:
- Calculate cost-per-km when distance data is available
- Use actual vehicle data
"""
    
    async def run(self, state: RideMintState) -> RideMintState:
        llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL_FULL", "gpt-4o"), temperature=0.2, api_key=os.getenv("OPENAI_API_KEY"))
        
        user_id = state["user_id"]
        tools = [SQLTool(user_id=user_id), AnalyticsTool(user_id=user_id)]
        
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
            "chat_history": state["conversation_history"][-6:] if state.get("conversation_history") else []
        })
        
        state["response_text"] = result["output"]
        return state

async def operations_agent_node(state: RideMintState) -> RideMintState:
    agent = OperationsAgent()
    return await agent.run(state)
