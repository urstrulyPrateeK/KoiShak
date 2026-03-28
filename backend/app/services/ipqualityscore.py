from __future__ import annotations

from urllib.parse import quote_plus

import httpx

from app.settings import get_settings


async def scan(url: str) -> dict:
    settings = get_settings()
    if not settings.ipqualityscore_api_key:
        return {"risk_score": 0, "unsafe": False, "source": "offline"}

    endpoint = (
        "https://ipqualityscore.com/api/json/url/"
        f"{settings.ipqualityscore_api_key}/{quote_plus(url)}"
    )
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(endpoint)
            response.raise_for_status()
            data = response.json()
            return {
                "risk_score": int(data.get("risk_score", 0)),
                "unsafe": bool(data.get("unsafe")) or bool(data.get("phishing")) or bool(data.get("malware")),
                "domain_age": data.get("domain_age", {}),
                "source": "ipqualityscore",
            }
    except Exception:
        return {"risk_score": 0, "unsafe": False, "source": "offline"}
