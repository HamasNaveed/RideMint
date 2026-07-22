import os
from abc import ABC, abstractmethod
from backend.graph.state import RideMintState

def get_agent_llm(temperature: float = 0.2):
    MODEL_NAME = os.environ.get("RAG_AGENT_MODEL", "models/gemini-3.1-flash-lite")
    groq_key = os.environ.get("GROQ_API_KEY")
    google_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if groq_key:
        try:
            from langchain_groq import ChatGroq
            groq_model = MODEL_NAME if ("llama" in MODEL_NAME.lower() or "mixtral" in MODEL_NAME.lower() or "gemma" in MODEL_NAME.lower()) else "llama-3.3-70b-versatile"
            return ChatGroq(model_name=groq_model, temperature=temperature, groq_api_key=groq_key)
        except Exception:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(
                model="llama-3.3-70b-versatile",
                temperature=temperature,
                api_key=groq_key,
                base_url="https://api.groq.com/openai/v1"
            )
    elif google_key:
        from langchain_google_genai import ChatGoogleGenerativeAI
        clean_model = MODEL_NAME.replace("models/", "")
        return ChatGoogleGenerativeAI(model=clean_model, temperature=temperature, google_api_key=google_key)
    else:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=os.environ.get("OPENAI_MODEL_FULL", "gpt-4o"),
            temperature=temperature,
            api_key=openai_key or "mock"
        )

class BaseAgent(ABC):
    @abstractmethod
    async def run(self, state: RideMintState) -> RideMintState:
        pass
