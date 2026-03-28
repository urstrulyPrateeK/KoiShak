from __future__ import annotations

from pathlib import Path
import pickle
import random

try:
    from sklearn.ensemble import RandomForestClassifier
except Exception:  # pragma: no cover
    RandomForestClassifier = None

from app.engines.ml_classifier import HeuristicPhishingModel
from app.models.feature_extractor import extract_features


MODEL_PATH = Path(__file__).resolve().parent / "app" / "models" / "phishing_model.pkl"


BENIGN_URLS = [
    "https://google.com",
    "https://github.com/openai",
    "https://huly.io",
    "https://wikipedia.org/wiki/QR_code",
    "https://example.com/account/profile",
]

PHISHY_URLS = [
    "http://bit.ly/claim-now",
    "http://198.51.100.10/login/verify",
    "https://secure-banking-otp-claim.xyz/login",
    "http://paytm-support-login.zip/auth",
    "https://google.com.secure-update.click/reset",
]


def build_dataset() -> tuple[list[list[float]], list[int]]:
    rows: list[list[float]] = []
    targets: list[int] = []
    for url in BENIGN_URLS:
        for _ in range(16):
            rows.append(extract_features(url))
            targets.append(0)
    for url in PHISHY_URLS:
        for _ in range(16):
            rows.append(extract_features(url))
            targets.append(1)

    combined = list(zip(rows, targets))
    random.shuffle(combined)
    return [row for row, _ in combined], [target for _, target in combined]


def main() -> None:
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    if RandomForestClassifier is None:
        model = HeuristicPhishingModel()
    else:
        rows, targets = build_dataset()
        model = RandomForestClassifier(n_estimators=160, random_state=42)
        model.fit(rows, targets)

    with MODEL_PATH.open("wb") as file:
        pickle.dump(model, file)

    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    main()
