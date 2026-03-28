from __future__ import annotations

import re
import unicodedata
from urllib.parse import parse_qs, urlparse


PAYLOAD_TYPES: dict[str, str] = {
    "URL": r"^https?://",
    "UPI": r"^upi://pay\?",
    "WIFI": r"^WIFI:",
    "SMS": r"^smsto:|^sms:",
    "EMAIL": r"^mailto:",
    "TEL": r"^tel:",
    "VCARD": r"^BEGIN:VCARD",
    "GEO": r"^geo:",
    "CALENDAR": r"^BEGIN:VCALENDAR",
    "INTENT": r"^intent:|^[a-zA-Z][a-zA-Z0-9+\-.]+://(?!http)",
    "TEXT": r".*",
}

SHORTENER_DOMAINS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "rb.gy",
    "cutt.ly",
    "tiny.one",
    "is.gd",
    "rebrand.ly",
    "lnkd.in",
}


def classify_payload(payload: str) -> dict[str, str | bool]:
    normalized = payload.strip()
    payload_type = "TEXT"
    for candidate, pattern in PAYLOAD_TYPES.items():
        if re.match(pattern, normalized, flags=re.IGNORECASE):
            payload_type = candidate
            break

    subtype = None
    is_shortened = False
    has_ip = False
    homoglyph = False
    is_dynamic_upi = False
    is_collect_request = False

    if payload_type == "URL":
        parsed = urlparse(normalized)
        host = (parsed.hostname or "").lower()
        is_shortened = host in SHORTENER_DOMAINS
        has_ip = bool(re.fullmatch(r"(\d{1,3}\.){3}\d{1,3}", host))
        normalized_host = unicodedata.normalize("NFKC", host)
        homoglyph = normalized_host != host
        if is_shortened:
            subtype = "shortened_url"
        elif has_ip:
            subtype = "ip_address_url"
        elif homoglyph:
            subtype = "homoglyph_url"
        else:
            subtype = "standard_url"

    if payload_type == "UPI":
        params = parse_qs(urlparse(normalized).query)
        amount = params.get("am", [""])[0]
        is_dynamic_upi = bool(amount)
        is_collect_request = bool(params.get("tr") and amount and not params.get("mc"))
        subtype = "dynamic_upi" if is_dynamic_upi else "static_upi"
        if is_collect_request:
            subtype = "collect_request_upi"

    if payload_type == "INTENT":
        subtype = "deep_link"

    if payload_type == "TEXT":
        subtype = "plain_text"

    return {
        "payload_type": payload_type,
        "payload_subtype": subtype or payload_type.lower(),
        "shortened_url_detected": is_shortened,
        "has_ip_address": has_ip,
        "homoglyph_domain": homoglyph,
        "is_dynamic_upi": is_dynamic_upi,
        "collect_request_pattern": is_collect_request,
    }
