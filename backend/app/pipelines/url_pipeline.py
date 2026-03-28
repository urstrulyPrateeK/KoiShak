from __future__ import annotations

import asyncio
import ipaddress
import re
import unicodedata
from urllib.parse import urlparse

from app.engines.ml_classifier import predict_url_probability
from app.pipelines.common import build_signal
from app.services import domain_age, ipqualityscore, redirect_expander, safe_browsing, virustotal


SHORTENERS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "rb.gy",
    "is.gd",
    "tiny.one",
    "cutt.ly",
}

SUSPICIOUS_TLDS = {"zip", "country", "click", "gq", "work", "top", "xyz"}


def is_shortened(url: str) -> bool:
    hostname = (urlparse(url).hostname or "").lower()
    return hostname in SHORTENERS


def has_ip_in_url(url: str) -> bool:
    hostname = urlparse(url).hostname or ""
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


def check_homoglyph(url: str) -> bool:
    hostname = urlparse(url).hostname or ""
    normalized = unicodedata.normalize("NFKC", hostname)
    return normalized != hostname


def check_tld(url: str) -> bool:
    hostname = (urlparse(url).hostname or "").lower()
    parts = hostname.split(".")
    if len(parts) < 2:
        return False
    return parts[-1] in SUSPICIOUS_TLDS


async def analyze_url(url: str) -> dict:
    expanded_url, redirect_chain = await redirect_expander.expand_redirects(url)
    vt_result, gsb_result, ipqs_result, age_result = await asyncio.gather(
        virustotal.scan(expanded_url),
        safe_browsing.check(expanded_url),
        ipqualityscore.scan(expanded_url),
        domain_age.check(expanded_url),
    )

    ml_probability = predict_url_probability(expanded_url)
    redirect_depth = max(len(redirect_chain) - 1, 0)
    shortened = is_shortened(url)
    homoglyph = check_homoglyph(expanded_url)
    suspicious_tld = check_tld(expanded_url)
    missing_https = not expanded_url.startswith("https://")

    signals = [
        build_signal(
            "virustotal_hits",
            vt_result["malicious_count"] > 0,
            f'{vt_result["malicious_count"]} engines flagged this URL' if vt_result["malicious_count"] else "No VirusTotal engines flagged this URL",
            weight=35,
            severity="danger",
        ),
        build_signal(
            "safe_browsing_match",
            gsb_result["is_threat"],
            gsb_result["detail"],
            weight=25,
            severity="danger",
        ),
        build_signal(
            "domain_age_under_30_days",
            age_result["age_days"] < 30,
            f'Domain appears {age_result["age_days"]} days old',
            weight=15,
            severity="warning",
        ),
        build_signal(
            "shortened_url_detected",
            shortened,
            "Shortened URL hides the final destination" if shortened else "No shortener detected",
            weight=10,
            severity="warning",
        ),
        build_signal(
            "redirect_chain_depth_gt_2",
            redirect_depth > 2,
            f"Redirect chain contains {redirect_depth} hop(s)",
            weight=5,
            severity="warning",
        ),
        build_signal(
            "homoglyph_domain",
            homoglyph,
            "Domain contains unicode that can impersonate trusted brands" if homoglyph else "No homoglyph trick detected",
            weight=5,
            severity="warning",
        ),
        build_signal(
            "https_missing",
            missing_https,
            "Connection is not protected by HTTPS" if missing_https else "HTTPS is present",
            weight=3,
            severity="warning",
        ),
        build_signal(
            "suspicious_tld",
            suspicious_tld,
            "Domain uses a higher-risk TLD" if suspicious_tld else "TLD is commonly used",
            weight=2,
            severity="warning",
        ),
        build_signal(
            "ml_phishing_score",
            ml_probability >= 0.7,
            f"ML model estimates {round(ml_probability * 100)}% phishing probability",
            weight=round(ml_probability * 20),
            severity="danger" if ml_probability >= 0.7 else "info",
        ),
    ]

    preview = {
        "final_url": expanded_url,
        "domain": urlparse(expanded_url).hostname,
        "redirect_chain": redirect_chain,
        "ipqs_risk_score": ipqs_result.get("risk_score", 0),
        "flags": {
            "shortened": shortened,
            "has_ip_address": has_ip_in_url(expanded_url),
            "homoglyph": homoglyph,
            "suspicious_tld": suspicious_tld,
        },
    }

    subtype = "shortened_url" if shortened else "url"
    if has_ip_in_url(expanded_url):
        subtype = "ip_address_url"
    if re.search(r"@|%[0-9A-Fa-f]{2}", expanded_url):
        subtype = "obfuscated_url"

    return {
        "payload_subtype": subtype,
        "expanded_url": expanded_url,
        "signals": signals,
        "payload_preview": preview,
    }
