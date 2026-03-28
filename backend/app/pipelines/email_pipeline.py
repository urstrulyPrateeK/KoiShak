from __future__ import annotations

from urllib.parse import parse_qs, unquote, urlparse

from app.pipelines.common import build_signal


def analyze_email(payload: str) -> dict:
    parsed = urlparse(payload)
    recipient = parsed.path
    params = parse_qs(parsed.query)
    subject = unquote(params.get("subject", [""])[0])
    body = unquote(params.get("body", [""])[0])
    suspicious = any(term in body.lower() for term in ["password", "otp", "urgent", "gift", "claim"])

    signals = [
        build_signal(
            "urgent_language",
            suspicious,
            "Email draft includes urgency or credential-request language" if suspicious else "Draft does not contain common scam language",
            weight=20,
            severity="warning",
        )
    ]

    return {
        "payload_subtype": "email_draft",
        "signals": signals,
        "payload_preview": {
            "recipient": recipient or "Unknown",
            "subject": subject or "No subject",
            "body": body or "Empty body",
        },
    }
