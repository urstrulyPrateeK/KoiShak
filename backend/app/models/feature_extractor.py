from __future__ import annotations

import math
import re
from urllib.parse import urlparse


SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "rb.gy",
    "is.gd", "cutt.ly", "shorturl.at", "tiny.one", "lnkd.in",
}

RISKY_TLDS = {
    "zip": 0.95, "country": 0.8, "click": 0.75, "gq": 0.7,
    "work": 0.65, "top": 0.6, "xyz": 0.55, "shop": 0.45,
    "loan": 0.7, "win": 0.65, "racing": 0.6, "icu": 0.55,
}

BRAND_KEYWORDS = {
    "paypal", "google", "amazon", "facebook", "microsoft", "apple",
    "netflix", "paytm", "phonepe", "sbi", "hdfc", "icici",
}


def shannon_entropy(value: str) -> float:
    if not value:
        return 0
    probabilities = [value.count(char) / len(value) for char in set(value)]
    return -sum(prob * math.log2(prob) for prob in probabilities)


def extract_features(url: str) -> list[float]:
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    tld = hostname.split(".")[-1] if "." in hostname else ""
    query = parsed.query or ""

    digit_chars = sum(1 for c in url if c.isdigit())
    domain_without_dots = hostname.replace(".", "")
    alpha_in_domain = [c for c in domain_without_dots if c.isalpha()]

    has_ip = bool(re.fullmatch(r"(\d{1,3}\.){3}\d{1,3}", hostname))
    has_hex = bool(re.search(r"%[0-9a-fA-F]{2}", url))
    has_shortener = hostname.lower() in SHORTENERS
    dot_count = url.count(".")
    hyphen_count = url.count("-")
    at_symbol = "@" in url
    double_slash = url.rfind("//") > 6
    subdomain_depth = max(len(hostname.split(".")) - 2, 0)
    path_depth = len([p for p in path.split("/") if p])
    digit_ratio = digit_chars / max(len(url), 1)

    # Additional features
    special_char_count = sum(1 for c in url if c in "!#$%^&*()=+[]{}|;',<>?~`")
    vowel_count = sum(1 for c in domain_without_dots.lower() if c in "aeiou")
    consonant_count = len(alpha_in_domain) - vowel_count
    vowel_ratio = vowel_count / max(consonant_count, 1)

    # Brand name in suspicious URL
    has_brand = any(brand in hostname.lower() for brand in BRAND_KEYWORDS)
    brand_in_path = any(brand in path.lower() for brand in BRAND_KEYWORDS)
    brand_suspicious = (has_brand or brand_in_path) and (has_ip or subdomain_depth > 2 or tld in RISKY_TLDS)

    return [
        float(len(url)),                                # 0: url_length
        float(dot_count),                               # 1: dot_count
        float(hyphen_count),                            # 2: hyphen_count
        float(has_ip),                                  # 3: has_ip_address
        float(digit_ratio),                             # 4: digit_ratio
        float(has_shortener),                           # 5: has_shortener
        float(subdomain_depth),                         # 6: subdomain_depth
        float(RISKY_TLDS.get(tld, 0)),                  # 7: tld_risk_score
        float(shannon_entropy(domain_without_dots)),    # 8: domain_entropy
        float(path_depth),                              # 9: path_depth
        float(at_symbol),                               # 10: at_symbol
        float(double_slash),                            # 11: double_slash
        float(has_hex),                                 # 12: hex_encoding
    ]
