from fastapi import APIRouter

from app.models.schemas import HistoryRecord
from app.utils.history_store import history_store


router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=list[HistoryRecord])
async def get_history(limit: int = 50) -> list[dict]:
    return history_store.list(limit)
