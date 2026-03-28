from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter

from app.engines.content_scanner import scan_content
from app.engines.payload_classifier import classify_payload
from app.engines.risk_scorer import score_signals
from app.models.schemas import BatchScanRequest, ScanRequest, ScanResult
from app.pipelines.calendar_pipeline import analyze_calendar
from app.pipelines.deeplink_pipeline import analyze_deeplink
from app.pipelines.email_pipeline import analyze_email
from app.pipelines.geo_pipeline import analyze_geo
from app.pipelines.sms_pipeline import analyze_sms
from app.pipelines.tel_pipeline import analyze_tel
from app.pipelines.text_pipeline import analyze_text
from app.pipelines.upi_pipeline import analyze_upi
from app.pipelines.url_pipeline import analyze_url
from app.pipelines.vcard_pipeline import analyze_vcard
from app.pipelines.wifi_pipeline import analyze_wifi
from app.utils.history_store import history_store


router = APIRouter(prefix="/api/scan", tags=["scan"])

PIPELINE_MAP = {
    "URL": analyze_url,
    "UPI": analyze_upi,
    "WIFI": analyze_wifi,
    "SMS": analyze_sms,
    "EMAIL": analyze_email,
    "TEL": analyze_tel,
    "VCARD": analyze_vcard,
    "GEO": analyze_geo,
    "CALENDAR": analyze_calendar,
    "INTENT": analyze_deeplink,
}


async def analyze_payload(payload: str) -> dict:
    classified = classify_payload(payload)
    payload_type = str(classified["payload_type"])

    pipeline = PIPELINE_MAP.get(payload_type)
    if pipeline is None:
        result = analyze_text(payload)
    else:
        try:
            maybe_coro = pipeline(payload)
            if hasattr(maybe_coro, "__await__"):
                result = await maybe_coro
            else:
                result = maybe_coro
        except Exception:
            result = {"signals": [], "payload_preview": {"error": "Pipeline analysis failed"}}

    # Add offline content scanner signals
    try:
        extra_signals = scan_content(payload, payload_type)
        result["signals"].extend(extra_signals)
    except Exception:
        pass

    score, verdict = score_signals(payload_type, result["signals"])
    scan_id = str(uuid4())
    scanned_at = datetime.now(timezone.utc)

    response = {
        "scan_id": scan_id,
        "payload_type": payload_type,
        "payload_subtype": result.get("payload_subtype", classified["payload_subtype"]),
        "raw_payload": payload,
        "expanded_url": result.get("expanded_url"),
        "risk_score": score,
        "verdict": verdict,
        "signals": result["signals"],
        "payload_preview": result["payload_preview"],
        "scanned_at": scanned_at,
    }
    history_store.add(
        {
            "id": scan_id,
            "payload": payload,
            "payload_type": payload_type,
            "verdict": verdict,
            "risk_score": score,
            "signals": result["signals"],
            "expanded_url": result.get("expanded_url"),
            "created_at": scanned_at,
        }
    )
    return response


@router.post("", response_model=ScanResult)
async def scan_payload(request: ScanRequest) -> dict:
    return await analyze_payload(request.payload)


@router.post("/batch", response_model=list[ScanResult])
async def scan_batch(request: BatchScanRequest) -> list[dict]:
    results: list[dict] = []
    for payload in request.payloads:
        results.append(await analyze_payload(payload))
    return results
