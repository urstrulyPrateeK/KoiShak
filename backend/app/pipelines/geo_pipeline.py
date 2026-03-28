from __future__ import annotations

from app.pipelines.common import build_signal


def analyze_geo(payload: str) -> dict:
    coords = payload.removeprefix("geo:")
    latitude, _, longitude = coords.partition(",")
    suspicious = not latitude or not longitude

    signals = [
        build_signal(
            "suspicious_text_content",
            suspicious,
            "Coordinates look malformed" if suspicious else "Coordinates parsed successfully",
            weight=20,
            severity="warning",
        )
    ]

    return {
        "payload_subtype": "geo_location",
        "signals": signals,
        "payload_preview": {
            "latitude": latitude or "Unknown",
            "longitude": longitude or "Unknown",
        },
    }
