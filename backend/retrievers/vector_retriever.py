from backend.db.supabase_client import get_pool

class VectorRetriever:
    async def search(self, user_id: str, embedding: list[float], limit: int = 5, source_tables: list[str] = None) -> list[dict]:
        pool = get_pool()
        
        table_filter = ""
        if source_tables:
            tables_str = ", ".join(f"'{t}'" for t in source_tables)
            table_filter = f"AND source_table IN ({tables_str})"
            
        embedding_str = "[" + ",".join(map(str, embedding)) + "]"
        
        query = f"""
            SELECT 
                id,
                source_table,
                source_id,
                content,
                metadata,
                1 - (embedding <=> $1::vector) AS similarity
            FROM public.document_embeddings
            WHERE user_id = $2 {table_filter}
            ORDER BY embedding <=> $1::vector
            LIMIT $3
        """
        
        rows = await pool.fetch(query, embedding_str, user_id, limit)
        return [dict(r) for r in rows if r["similarity"] > 0.7]

vector_retriever = VectorRetriever()
