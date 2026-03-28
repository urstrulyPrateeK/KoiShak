from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from app.pipelines.common import build_signal


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "upi_bank_handles.json"
UPI_HANDLES = set(json.loads(DATA_PATH.read_text(encoding="utf-8")))
URGENCY_WORDS = {"urgent", "immediately", "reward", "prize", "claim", "verify", "limited"}
IMPERSONATION_WORDS = {"bank", "sbi", "hdfc", "axis", "icici", "government", "gst", "income tax", "jio"}


def parse_upi_payload(payload: str) -> dict[str, str]:
    query = parse_qs(urlparse(payload).query)
    return {key: values[0] for key, values in query.items()}


def analyze_upi(payload: str) -> dict:
    fields = parse_upi_payload(payload)
    vpa = fields.get("pa", "")
    amount = fields.get("am", "")
    note = fields.get("tn", "")
    payee_name = fields.get("pn", "")

    vpa_valid = bool(re.fullmatch(r"[A-Za-z0-9.\-_]{2,}@[A-Za-z0-9.\-_]{2,}", vpa))
    handle = f"@{vpa.split('@')[1].lower()}" if "@" in vpa else ""
    amount_value = float(amount) if amount.replace(".", "", 1).isdigit() else 0.0
    suspicious_note = any(word in note.lower() for word in URGENCY_WORDS) or "http" in note.lower()
    impersonation = any(word in payee_name.lower() for word in IMPERSONATION_WORDS)
    collect_request = bool(fields.get("tr") and amount_value > 0 and not fields.get("mc"))
    high_amount = amount_value > 5000

    signals = [
        build_signal(
            "invalid_vpa_format",
            not vpa_valid,
            "UPI address format looks invalid" if not vpa_valid else "UPI address format looks valid",
            weight=40,
            severity="danger",
        ),
        build_signal(
            "unknown_bank_handle",
            bool(handle) and handle not in UPI_HANDLES,
            "UPI handle is not in the trusted bank handle list" if handle and handle not in UPI_HANDLES else "UPI handle looks familiar",
            weight=30,
            severity="warning",
        ),
        build_signal(
            "amount_preset",
            amount_value > 0,
            f"Amount preset to INR {amount_value:.2f}" if amount_value > 0 else "No amount preset in this QR",
            weight=15,
            severity="warning",
        ),
        build_signal(
            "suspicious_note_content",
            suspicious_note,
            "Transaction note includes urgency words, reward bait, or links"
            if suspicious_note
            else "Transaction note looks ordinary",
            weight=10,
            severity="warning",
        ),
        build_signal(
            "high_amount_preset",
            high_amount,
            f"Large amount preset in QR: INR {amount_value:.2f}" if high_amount else "Preset amount is not unusually large",
            weight=10,
            severity="danger",
        ),
        build_signal(
            "payee_impersonation",
            impersonation,
            "Payee name resembles a bank, telecom brand, or government entity" if impersonation else "Payee name does not resemble a common impersonation target",
            weight=8,
            severity="warning",
        ),
        build_signal(
            "collect_request_pattern",
            collect_request,
            "Looks like a collect request pattern" if collect_request else "Not a collect-request pattern",
            weight=5,
            severity="warning",
        ),
    ]

    return {
        "payload_subtype": "dynamic_upi" if amount_value > 0 else "static_upi",
        "signals": signals,
        "payload_preview": {
            "payee": vpa or "Unknown",
            "name": payee_name or "Unknown",
            "amount": f"INR {amount_value:.2f}" if amount_value > 0 else "Not preset",
            "note": note or "None",
            "currency": fields.get("cu", "INR"),
            "collect_request": collect_request,
        },
    }
