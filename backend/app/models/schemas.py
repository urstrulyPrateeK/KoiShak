from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    payload: str = Field(..., min_length=1)


class BatchScanRequest(BaseModel):
    payloads: list[str] = Field(default_factory=list)


class SignalItem(BaseModel):
    key: str
    triggered: bool
    detail: str
    weight: float = 0
    severity: str = "info"


class ScanResult(BaseModel):
    scan_id: str
    payload_type: str
    payload_subtype: str | None = None
    raw_payload: str
    expanded_url: str | None = None
    risk_score: int
    verdict: str
    signals: list[SignalItem]
    payload_preview: dict[str, Any]
    scanned_at: datetime


class HistoryRecord(BaseModel):
    id: str
    payload: str
    payload_type: str
    verdict: str
    risk_score: int
    signals: list[dict[str, Any]]
    expanded_url: str | None = None
    created_at: datetime
