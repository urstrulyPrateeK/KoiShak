from __future__ import annotations

from datetime import datetime
from urllib.parse import urlparse

import httpx

from app.settings import get_settings


KNOWN_OLD_DOMAINS = {
    "google.com",
    "openai.com",
    "huly.io",
    "github.com",
    "wikipedia.org",
}


async def check(url: str) -> dict:
    hostname = (urlparse(url).hostname or "").lower()
    if hostname in KNOWN_OLD_DOMAINS:
        return {"age_days": 3650, "source": "offline"}

    settings = get_settings()
    if not settings.whois_api_key:
        return {"age_days": 15, "source": "heuristic"}

    endpoint = f"https://whoisjsonapi.com/v1/{hostname}"
    headers = {"Authorization": f"Bearer {settings.whois_api_key}"}
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(endpoint, headers=headers)
            response.raise_for_status()
            data = response.json()
            domain = data.get("domain", {}) if isinstance(data, dict) else {}
            created = (
                domain.get("created_date")
                or domain.get("created_date_in_time")
                or data.get("created")
            )
            if not created:
                return {"age_days": 15, "source": "heuristic"}
            created_at = datetime.fromisoformat(created.replace("Z", "+00:00"))
            age = max((datetime.now(created_at.tzinfo) - created_at).days, 0)
            return {"age_days": age, "source": "whois"}
    except Exception:
        return {"age_days": 15, "source": "heuristic"}
