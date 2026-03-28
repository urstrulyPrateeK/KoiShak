from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from app.pipelines.common import build_signal


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "trusted_deeplinks.json"
TRUSTED_SCHEMES = set(json.loads(DATA_PATH.read_text(encoding="utf-8")))


def analyze_deeplink(payload: str) -> dict:
    parsed = urlparse(payload)
    scheme = f"{parsed.scheme}://"
    trusted = scheme in TRUSTED_SCHEMES
    params = {key: values[0] for key, values in parse_qs(parsed.query).items()}
    obfuscated = "%" in payload or "@@" in payload or ".." in parsed.path

    signals = [
        build_signal(
            "unknown_app_intent",
            not trusted,
            "Unknown app intent scheme" if not trusted else "App scheme is in the trusted allowlist",
            weight=45,
            severity="danger",
        ),
        build_signal(
            "suspicious_text_content",
            obfuscated,
            "Deep link contains obfuscation patterns" if obfuscated else "No obfuscation detected in the intent",
            weight=15,
            severity="warning",
        ),
    ]

    return {
        "payload_subtype": "deep_link",
        "signals": signals,
        "payload_preview": {
            "scheme": scheme,
            "host": parsed.netloc or parsed.path.split("/")[0],
            "path": parsed.path,
            "params": params,
        },
    }
