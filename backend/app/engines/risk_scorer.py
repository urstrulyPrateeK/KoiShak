from __future__ import annotations

from typing import Any


URL_SIGNAL_WEIGHTS = {
    "virustotal_hits": 0.35,
    "safe_browsing_match": 0.25,
    "domain_age_under_30_days": 0.15,
    "shortened_url_detected": 0.10,
    "redirect_chain_depth_gt_2": 0.05,
    "homoglyph_domain": 0.05,
    "https_missing": 0.03,
    "suspicious_tld": 0.02,
}

UPI_SIGNAL_WEIGHTS = {
    "invalid_vpa_format": 0.40,
    "unknown_bank_handle": 0.30,
    "amount_preset": 0.15,
    "high_amount_preset": 0.10,
    "suspicious_note_content": 0.10,
    "payee_impersonation": 0.08,
    "collect_request_pattern": 0.05,
}

DEFAULT_SIGNAL_WEIGHTS = {
    "unsafe_open_network": 0.35,
    "legacy_encryption": 0.25,
    "hidden_network": 0.15,
    "unknown_app_intent": 0.45,
    "premium_rate_number": 0.35,
    "embedded_url_risk": 0.35,
    "urgent_language": 0.15,
    "suspicious_text_content": 0.2,
}

RISK_THRESHOLDS = {
    "SAFE": (0, 30),
    "SUSPICIOUS": (31, 60),
    "DANGEROUS": (61, 100),
}


def get_weight_map(payload_type: str) -> dict[str, float]:
    if payload_type == "URL":
        return URL_SIGNAL_WEIGHTS
    if payload_type == "UPI":
        return UPI_SIGNAL_WEIGHTS
    return DEFAULT_SIGNAL_WEIGHTS


def score_signals(payload_type: str, signals: list[dict[str, Any]]) -> tuple[int, str]:
    weights = get_weight_map(payload_type)
    total = 0.0
    for signal in signals:
        key = signal["key"]
        if signal.get("triggered"):
            total += weights.get(key, signal.get("weight", 0) / 100)

    ml_signal = next((signal for signal in signals if signal["key"] == "ml_phishing_score"), None)
    if ml_signal and ml_signal.get("triggered"):
        total += min(float(ml_signal.get("weight", 0)) / 100, 0.2)

    score = round(min(total, 1) * 100)
    for label, bounds in RISK_THRESHOLDS.items():
        low, high = bounds
        if low <= score <= high:
            return score, label
    return score, "DANGEROUS"
