from abc import ABC, abstractmethod
from backend.graph.state import RideMintState

class BaseAgent(ABC):
    @abstractmethod
    async def run(self, state: RideMintState) -> RideMintState:
        pass
