import os
import asyncpg
from supabase import create_client, Client

class DatabaseConfig:
    @staticmethod
    def get_supabase_client() -> Client:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError("Supabase URL and Service Role Key must be set.")
        return create_client(url, key)

    @staticmethod
    async def get_asyncpg_pool() -> asyncpg.Pool:
        db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:54322/postgres")
        pool = await asyncpg.create_pool(dsn=db_url, min_size=1, max_size=10)
        return pool

# Global instances
_supabase: Client = None
_db_pool: asyncpg.Pool = None

async def init_db():
    global _supabase, _db_pool
    _supabase = DatabaseConfig.get_supabase_client()
    _db_pool = await DatabaseConfig.get_asyncpg_pool()

async def close_db():
    global _db_pool
    if _db_pool:
        await _db_pool.close()

def get_supabase() -> Client:
    if not _supabase:
        raise RuntimeError("Supabase client not initialized")
    return _supabase

def get_pool() -> asyncpg.Pool:
    if not _db_pool:
        raise RuntimeError("Database pool not initialized")
    return _db_pool
