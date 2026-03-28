from __future__ import annotations

import json
import re
from pathlib import Path

from app.pipelines.common import build_signal
from app.pipelines.url_pipeline import analyze_url


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "premium_rate_prefixes.json"
PREMIUM_PREFIXES = tuple(json.loads(DATA_PATH.read_text(encoding="utf-8")))
URL_PATTERN = re.compile(r"https?://[^\s]+", re.IGNORECASE)


def parse_sms_payload(payload: str) -> tuple[str, str]:
    body = payload.split(":", 1)
    scheme_and_number = body[0]
    number = scheme_and_number.split(":", 1)[-1].replace("smsto", "").replace("sms", "")
    message = body[1] if len(body) > 1 else ""
    return number.strip(":"), message


async def analyze_sms(payload: str) -> dict:
    number, message = parse_sms_payload(payload)
    found_urls = URL_PATTERN.findall(message)
    nested_url_analysis = await analyze_url(found_urls[0]) if found_urls else None
    premium = number.startswith(PREMIUM_PREFIXES)
    urgent = any(
        phrase in message.lower()
        for phrase in ["otp", "verify now", "your account", "click here", "claim", "urgent"]
    )
    international = number.startswith("+") and not number.startswith("+91")

    signals = [
        build_signal(
            "premium_rate_number",
            premium,
            "Number matches a premium-rate prefix" if premium else "Number does not match premium prefixes",
            weight=35,
            severity="danger",
        ),
        build_signal(
            "embedded_url_risk",
            bool(nested_url_analysis and any(item["triggered"] for item in nested_url_analysis["signals"])),
            "Message includes a risky URL" if nested_url_analysis and any(item["triggered"] for item in nested_url_analysis["signals"]) else "No risky URL detected in the message body",
            weight=35,
            severity="warning",
        ),
        build_signal(
            "urgent_language",
            urgent or international,
            "Message uses urgency or comes from an unexpected international number"
            if urgent or international
            else "Message language looks routine",
            weight=15,
            severity="warning",
        ),
    ]

    return {
        "payload_subtype": "sms_message",
        "signals": signals,
        "payload_preview": {
            "number": number or "Unknown",
            "message": message or "Empty body",
            "embedded_urls": found_urls,
        },
    }
