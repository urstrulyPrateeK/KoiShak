from __future__ import annotations

from urllib.parse import urlparse

import httpx


async def expand_redirects(url: str, limit: int = 5) -> tuple[str, list[str]]:
    chain = [url]
    current = url
    try:
        async with httpx.AsyncClient(follow_redirects=False, timeout=6.0) as client:
            for _ in range(limit):
                response = await client.get(current)
                location = response.headers.get("location")
                if not location or response.status_code not in {301, 302, 303, 307, 308}:
                    break
                if location.startswith("/"):
                    parsed = urlparse(current)
                    location = f"{parsed.scheme}://{parsed.netloc}{location}"
                chain.append(location)
                current = location
    except Exception:
        return url, chain
    return current, chain
