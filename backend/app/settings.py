from functools import lru_cache
from pathlib import Path
import os

from dotenv import load_dotenv
from pydantic import BaseModel


ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")


class Settings(BaseModel):
    app_env: str = os.getenv("APP_ENV", "development")
    cache_ttl_seconds: int = int(os.getenv("CACHE_TTL_SECONDS", "600"))
    virustotal_api_key: str = os.getenv("VIRUSTOTAL_API_KEY", "")
    google_safe_browsing_api_key: str = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")
    ipqualityscore_api_key: str = os.getenv("IPQUALITYSCORE_API_KEY", "")
    whois_api_key: str = os.getenv("WHOIS_API_KEY", "")
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")


@lru_cache
def get_settings() -> Settings:
    return Settings()
