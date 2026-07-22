import json
from datetime import datetime
from backend.db.supabase_client import get_supabase
from .redis_client import redis_client

class SessionMemory:
    def _key(self, user_id: str, session_id: str) -> str:
        return f"session:{user_id}:{session_id}:messages"

    async def get_history(self, user_id: str, session_id: str, n: int = 10) -> list[dict]:
        key = self._key(user_id, session_id)
        cached = await redis_client.lrange(key, -(n*2), -1)
        if cached:
            return [json.loads(m) for m in cached]
            
        supabase = get_supabase()
        result = supabase.table("ai_conversations") \
            .select("role,content,created_at").eq("user_id", user_id) \
            .eq("session_id", session_id).order("created_at").limit(n*2).execute()
        
        if result.data:
            async with redis_client.pipeline(transaction=True) as pipe:
                for msg in result.data:
                    pipe.rpush(key, json.dumps(msg))
                pipe.expire(key, 86400)
                await pipe.execute()
                
        return result.data

    async def add_message(self, user_id: str, session_id: str, role: str, content: str, metadata: dict = None):
        msg = {
            "user_id": user_id, 
            "session_id": session_id,
            "role": role, 
            "content": content, 
            "metadata": metadata or {},
            "created_at": datetime.utcnow().isoformat()
        }
        
        key = self._key(user_id, session_id)
        async with redis_client.pipeline(transaction=True) as pipe:
            pipe.rpush(key, json.dumps(msg))
            pipe.ltrim(key, -40, -1)
            pipe.expire(key, 86400)
            await pipe.execute()
            
        supabase = get_supabase()
        supabase.table("ai_conversations").insert(msg).execute()

session_memory = SessionMemory()
