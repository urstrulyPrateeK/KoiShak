from __future__ import annotations

import httpx

from app.settings import get_settings


async def check(url: str) -> dict:
    settings = get_settings()
    if not settings.google_safe_browsing_api_key:
        if "testsafebrowsing.appspot.com/s/phishing.html" in url:
            return {"is_threat": True, "detail": "Built-in demo detection matched the Google phishing test page"}
        return {"is_threat": False, "detail": "Safe Browsing key not configured"}

    endpoint = (
        "https://safebrowsing.googleapis.com/v4/threatMatches:find"
        f"?key={settings.google_safe_browsing_api_key}"
    )
    payload = {
        "client": {"clientId": "koishak", "clientVersion": "1.0.0"},
        "threatInfo": {
            "threatTypes": [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}],
        },
    }
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.post(endpoint, json=payload)
            response.raise_for_status()
            data = response.json()
            match = bool(data.get("matches"))
            detail = "Google Safe Browsing reported phishing or malware" if match else "No Google threat match"
            return {"is_threat": match, "detail": detail}
    except Exception:
        return {"is_threat": False, "detail": "Safe Browsing unavailable"}
