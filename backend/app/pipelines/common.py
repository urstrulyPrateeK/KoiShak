from __future__ import annotations

from typing import Any


def build_signal(
    key: str,
    triggered: bool,
    detail: str,
    weight: float = 0,
    severity: str = "info",
) -> dict[str, Any]:
    return {
        "key": key,
        "triggered": triggered,
        "detail": detail,
        "weight": weight,
        "severity": severity,
    }
