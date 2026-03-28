"""Cross-payload content scanner for data exfiltration and scam detection.

This engine runs entirely offline — no API calls needed.
"""

from __future__ import annotations

import re
from typing import Any

from app.engines.text_analysis import (
    analyze_text_content,
    detect_brand_impersonation,
    detect_sensitive_data,
)
from app.pipelines.common import build_signal


def scan_content(payload: str, payload_type: str) -> list[dict[str, Any]]:
    """Generate additional signals from offline content analysis."""
    signals: list[dict[str, Any]] = []
    analysis = analyze_text_content(payload)

    # Sensitive data exfiltration detection
    if analysis["sensitive_data_found"]:
        signals.append(build_signal(
            "sensitive_data_exfiltration",
            True,
            f"Payload may contain: {', '.join(analysis['sensitive_data_found'])}",
            weight=30,
            severity="danger",
        ))

    # Scam pattern detection
    if analysis["scam_patterns"]:
        signals.append(build_signal(
            "scam_pattern_detected",
            True,
            f"Detected: {', '.join(analysis['scam_patterns'][:2])}",
            weight=25,
            severity="danger",
        ))

    # Brand impersonation in non-standard context
    brands = analysis["brand_impersonation"]
    if brands and payload_type not in ("URL",):
        signals.append(build_signal(
            "brand_impersonation",
            True,
            f"References to {', '.join(brands[:3])} in {payload_type} payload",
            weight=15,
            severity="warning",
        ))

    # High entropy / encoded content
    if analysis["has_base64_encoding"]:
        signals.append(build_signal(
            "base64_encoded_content",
            True,
            "Payload appears to contain base64-encoded data",
            weight=10,
            severity="warning",
        ))

    # Excessive urgency
    if analysis["urgency_word_count"] >= 3:
        signals.append(build_signal(
            "excessive_urgency",
            True,
            f"Found {analysis['urgency_word_count']} urgency/pressure words",
            weight=15,
            severity="warning",
        ))

    return signals
