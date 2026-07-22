from backend.graph.state import RideMintState
from backend.embeddings.embedder import embedder
from backend.retrievers.vector_retriever import vector_retriever

async def retrieve_context_node(state: RideMintState) -> RideMintState:
    user_id = state["user_id"]
    
    embedding = await embedder.embed(state["user_message"])
    docs = await vector_retriever.search(
        user_id=user_id,
        embedding=embedding,
        limit=5
    )
    
    state["retrieved_docs"] = [doc["content"] for doc in docs]
    state["sql_results"] = []
    
    return state
