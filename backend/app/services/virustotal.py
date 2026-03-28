from __future__ import annotations

import base64

import httpx

from app.settings import get_settings
from app.utils.cache import TTLCache


cache = TTLCache(get_settings().cache_ttl_seconds)


async def scan(url: str) -> dict:
    cache_key = f"vt:{url}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    settings = get_settings()
    if not settings.virustotal_api_key:
        if "testsafebrowsing.appspot.com/s/phishing.html" in url:
            result = {"malicious_count": 2, "source": "offline-demo"}
            cache.set(cache_key, result)
            return result
        result = {"malicious_count": 0, "source": "offline"}
        cache.set(cache_key, result)
        return result

    url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
    endpoint = f"https://www.virustotal.com/api/v3/urls/{url_id}"
    headers = {"x-apikey": settings.virustotal_api_key}
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(endpoint, headers=headers)
            response.raise_for_status()
            data = response.json()
            stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
            result = {
                "malicious_count": int(stats.get("malicious", 0)) + int(stats.get("suspicious", 0)),
                "source": "virustotal",
            }
            cache.set(cache_key, result)
            return result
    except Exception:
        result = {"malicious_count": 0, "source": "offline"}
        cache.set(cache_key, result)
        return result
