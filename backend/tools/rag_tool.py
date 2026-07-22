from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from backend.retrievers.vector_retriever import vector_retriever
from backend.embeddings.embedder import embedder

class RAGInput(BaseModel):
    query: str = Field(description="The user's query about their business history")
    limit: int = Field(default=5)

class RAGTool(BaseTool):
    name = "search_business_history"
    description = (
        "Semantically search through historical business logs. "
        "Use this when the user asks about specific events, unusual days, "
        "or to find contextual information from past records."
    )
    args_schema = RAGInput
    _user_id: str = ""
    
    def __init__(self, user_id: str, **kwargs):
        super().__init__(**kwargs)
        self._user_id = user_id
    
    async def _arun(self, query: str, limit: int = 5) -> str:
        embedding = await embedder.embed(query[:1000])
        docs = await vector_retriever.search(
            user_id=self._user_id,
            embedding=embedding,
            limit=min(limit, 10)
        )
        if not docs:
            return "No relevant historical records found for this query."
        
        return "\n\n---\n\n".join([
            f"[{doc['source_table']} | {doc.get('metadata', {}).get('date', 'unknown')}]\n{doc['content']}"
            for doc in docs
        ])
