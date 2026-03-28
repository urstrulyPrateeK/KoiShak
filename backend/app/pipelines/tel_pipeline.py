from __future__ import annotations

import json
from pathlib import Path

from app.pipelines.common import build_signal


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "premium_rate_prefixes.json"
PREMIUM_PREFIXES = tuple(json.loads(DATA_PATH.read_text(encoding="utf-8")))


def analyze_tel(payload: str) -> dict:
    number = payload.removeprefix("tel:")
    premium = number.startswith(PREMIUM_PREFIXES)
    international = number.startswith("+") and not number.startswith("+91")

    signals = [
        build_signal(
            "premium_rate_number",
            premium or international,
            "Number is premium-rate or unexpectedly international" if premium or international else "Number format looks ordinary",
            weight=35,
            severity="warning",
        )
    ]

    return {
        "payload_subtype": "phone_number",
        "signals": signals,
        "payload_preview": {
            "number": number or "Unknown",
        },
    }
