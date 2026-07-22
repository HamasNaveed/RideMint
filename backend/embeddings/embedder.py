import os
from openai import AsyncOpenAI

class Embedder:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

    async def embed(self, text: str) -> list[float]:
        if not text:
            return []
        response = await self.client.embeddings.create(
            input=[text],
            model=self.model
        )
        return response.data[0].embedding

embedder = Embedder()
