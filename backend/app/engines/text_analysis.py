"""Offline text/content analysis engine — no external API calls needed.

Provides entropy analysis, scam pattern detection, urgency word scoring,
and base64/hex payload detection for all text-based QR payloads.
"""

from __future__ import annotations

import math
import re
from typing import Any


URGENCY_WORDS = {
    "urgent", "immediately", "now", "hurry", "limited", "expiring", "act now",
    "claim", "winner", "congratulations", "prize", "reward", "free", "bonus",
    "verify", "confirm", "suspend", "blocked", "unauthorized", "alert",
    "click here", "tap here", "open now", "don't miss", "last chance",
}

SCAM_PATTERNS = [
    (r"(?i)(you\s+have\s+won|you\s+are\s+selected)", "lottery/prize scam language"),
    (r"(?i)(your\s+account\s+(has\s+been|is)\s+(blocked|suspended|compromised))", "account scare tactic"),
    (r"(?i)(kyc|aadhar|aadhaar|pan\s*card)\s+(update|verify|expir)", "KYC/document phishing"),
    (r"(?i)(otp|password|pin)\s*(is|:|\s)\s*\d", "credential sharing attempt"),
    (r"(?i)(cash\s*back|refund)\s*(of|:)?\s*(rs\.?|inr|₹)\s*\d", "fake refund/cashback bait"),
]

SENSITIVE_DATA_PATTERNS = [
    (r"\b\d{4}\s?\d{4}\s?\d{4}\b", "Aadhaar number pattern"),
    (r"\b[A-Z]{5}\d{4}[A-Z]\b", "PAN number pattern"),
    (r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b", "Credit/debit card number pattern"),
    (r"\b\d{10,12}\b", "Phone number / large numeric ID"),
]

BRAND_IMPERSONATION = [
    "paypal", "paytm", "phonepe", "gpay", "google pay", "amazon", "flipkart",
    "sbi", "hdfc", "icici", "axis", "kotak", "rbi", "income tax", "government",
    "aadhaar", "gmail", "microsoft", "apple", "netflix", "whatsapp",
]


def shannon_entropy(text: str) -> float:
    if not text:
        return 0.0
    probs = [text.count(c) / len(text) for c in set(text)]
    return -sum(p * math.log2(p) for p in probs if p > 0)


def detect_base64(text: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9+/=]{20,}", text.strip()))


def detect_hex_encoding(text: str) -> bool:
    return bool(re.search(r"(%[0-9A-Fa-f]{2}){3,}", text))


def count_urgency_words(text: str) -> int:
    lower = text.lower()
    return sum(1 for w in URGENCY_WORDS if w in lower)


def detect_scam_patterns(text: str) -> list[str]:
    return [desc for pattern, desc in SCAM_PATTERNS if re.search(pattern, text)]


def detect_sensitive_data(text: str) -> list[str]:
    return [desc for pattern, desc in SENSITIVE_DATA_PATTERNS if re.search(pattern, text)]


def detect_brand_impersonation(text: str) -> list[str]:
    lower = text.lower()
    return [brand for brand in BRAND_IMPERSONATION if brand in lower]


def analyze_text_content(text: str) -> dict[str, Any]:
    """Run all offline content analysis on any text payload."""
    entropy = shannon_entropy(text)
    urgency_count = count_urgency_words(text)
    scam_matches = detect_scam_patterns(text)
    sensitive_data = detect_sensitive_data(text)
    brands = detect_brand_impersonation(text)
    has_base64 = detect_base64(text)
    has_hex = detect_hex_encoding(text)

    # Caps ratio — excessive caps is a scam indicator
    alpha_chars = [c for c in text if c.isalpha()]
    caps_ratio = sum(1 for c in alpha_chars if c.isupper()) / max(len(alpha_chars), 1)

    return {
        "entropy": round(entropy, 2),
        "high_entropy": entropy > 4.5,
        "urgency_word_count": urgency_count,
        "scam_patterns": scam_matches,
        "sensitive_data_found": sensitive_data,
        "brand_impersonation": brands,
        "has_base64_encoding": has_base64,
        "has_hex_encoding": has_hex,
        "excessive_caps": caps_ratio > 0.5 and len(alpha_chars) > 10,
        "caps_ratio": round(caps_ratio, 2),
    }
