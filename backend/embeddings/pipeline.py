import json
from backend.db.supabase_client import get_pool
from .embedder import embedder

async def embed_and_store(user_id: str, source_table: str, source_id: str, content: str, metadata: dict):
    pool = get_pool()
    embedding = await embedder.embed(content)
    embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    
    query = """
        INSERT INTO public.document_embeddings 
        (user_id, source_table, source_id, content, embedding, metadata)
        VALUES ($1, $2, $3, $4, $5::vector, $6)
    """
    await pool.execute(query, user_id, source_table, source_id, content, embedding_str, json.dumps(metadata))
