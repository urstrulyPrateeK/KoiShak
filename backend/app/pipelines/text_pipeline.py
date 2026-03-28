from __future__ import annotations

import re

from app.pipelines.common import build_signal


def analyze_text(payload: str) -> dict:
    suspicious = bool(re.search(r"claim|otp|password|reward|urgent|bank", payload, re.IGNORECASE))
    signals = [
        build_signal(
            "suspicious_text_content",
            suspicious,
            "Text includes scam-like language" if suspicious else "Text looks benign",
            weight=20,
            severity="warning",
        )
    ]

    return {
        "payload_subtype": "plain_text",
        "signals": signals,
        "payload_preview": {
            "text": payload,
        },
    }
