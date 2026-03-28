from __future__ import annotations

try:
    import vobject
except Exception:  # pragma: no cover
    vobject = None

from app.pipelines.common import build_signal


def analyze_vcard(payload: str) -> dict:
    contact_name = "Unknown"
    organization = "Unknown"
    if vobject is not None:
        try:
            card = vobject.readOne(payload)
            contact_name = getattr(getattr(card, "fn", None), "value", contact_name)
            organization = getattr(getattr(card, "org", None), "value", organization)
        except Exception:
            pass

    suspicious = organization != "Unknown" and any(word in str(organization).lower() for word in ["bank", "support", "loan"])
    signals = [
        build_signal(
            "suspicious_text_content",
            suspicious,
            "Contact card may impersonate a financial or support entity" if suspicious else "No impersonation signal detected",
            weight=20,
            severity="warning",
        )
    ]

    return {
        "payload_subtype": "contact_card",
        "signals": signals,
        "payload_preview": {
            "name": contact_name,
            "organization": organization,
        },
    }
