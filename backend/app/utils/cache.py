from __future__ import annotations

from collections import deque
from datetime import datetime, timezone
from typing import Any


class TTLCache:
    def __init__(self, ttl_seconds: int = 600) -> None:
        self._store: dict[str, tuple[Any, float]] = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> Any | None:
        entry = self._store.get(key)
        if entry is None:
            return None
        value, timestamp = entry
        if datetime.now(timezone.utc).timestamp() - timestamp > self._ttl:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any) -> None:
        self._store[key] = (value, datetime.now(timezone.utc).timestamp())
