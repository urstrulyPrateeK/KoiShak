from __future__ import annotations

from collections import deque
from typing import Any


class HistoryStore:
    def __init__(self, max_items: int = 200) -> None:
        self._items: deque[dict[str, Any]] = deque(maxlen=max_items)

    def add(self, item: dict[str, Any]) -> None:
        self._items.appendleft(item)

    def list(self, limit: int = 50) -> list[dict[str, Any]]:
        return list(self._items)[:limit]


history_store = HistoryStore()
