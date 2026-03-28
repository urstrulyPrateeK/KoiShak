from __future__ import annotations

try:
    from icalendar import Calendar
except Exception:  # pragma: no cover
    Calendar = None

from app.pipelines.common import build_signal


def analyze_calendar(payload: str) -> dict:
    summary = "Calendar Event"
    location = "Unknown"
    if Calendar is not None:
        try:
            calendar = Calendar.from_ical(payload)
            for component in calendar.walk():
                if component.name == "VEVENT":
                    summary = str(component.get("summary", summary))
                    location = str(component.get("location", location))
                    break
        except Exception:
            pass

    suspicious = any(term in summary.lower() for term in ["lottery", "claim", "prize"])
    signals = [
        build_signal(
            "suspicious_text_content",
            suspicious,
            "Calendar invite contains lure wording" if suspicious else "Invite looks ordinary",
            weight=20,
            severity="warning",
        )
    ]

    return {
        "payload_subtype": "calendar_event",
        "signals": signals,
        "payload_preview": {
            "summary": summary,
            "location": location,
        },
    }
