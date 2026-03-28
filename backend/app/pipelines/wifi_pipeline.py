from __future__ import annotations

import re

from app.pipelines.common import build_signal


EVIL_TWIN_PATTERNS = re.compile(r"free|airport|hotel|bank|guest", re.IGNORECASE)


def parse_wifi_payload(payload: str) -> dict[str, str]:
    body = payload.removeprefix("WIFI:")
    parts = [segment for segment in body.split(";") if ":" in segment]
    fields: dict[str, str] = {}
    for part in parts:
        key, value = part.split(":", 1)
        fields[key] = value
    return fields


def analyze_wifi(payload: str) -> dict:
    fields = parse_wifi_payload(payload)
    auth_type = fields.get("T", "").upper()
    ssid = fields.get("S", "")
    hidden = fields.get("H", "false").lower() == "true"

    signals = [
        build_signal(
            "unsafe_open_network",
            auth_type == "NOPASS",
            "Open network detected. Anyone nearby may intercept traffic." if auth_type == "NOPASS" else "Network requires authentication",
            weight=35,
            severity="danger" if auth_type == "NOPASS" else "info",
        ),
        build_signal(
            "legacy_encryption",
            auth_type == "WEP",
            "WEP encryption is outdated and unsafe" if auth_type == "WEP" else "No broken legacy encryption detected",
            weight=25,
            severity="warning",
        ),
        build_signal(
            "hidden_network",
            hidden,
            "Hidden network announced. Verify the SSID with the owner." if hidden else "Network is visible",
            weight=15,
            severity="warning",
        ),
        build_signal(
            "suspicious_text_content",
            bool(EVIL_TWIN_PATTERNS.search(ssid)),
            "SSID resembles common public hotspots and may be an evil twin" if EVIL_TWIN_PATTERNS.search(ssid) else "SSID does not match common lure patterns",
            weight=10,
            severity="warning",
        ),
    ]

    return {
        "payload_subtype": "wifi_network",
        "signals": signals,
        "payload_preview": {
            "network": ssid or "Unknown",
            "security": auth_type or "Unknown",
            "hidden": hidden,
            "password_hint": "Provided" if fields.get("P") else "Not provided",
        },
    }
