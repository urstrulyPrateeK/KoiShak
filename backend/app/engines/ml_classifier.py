from __future__ import annotations

from pathlib import Path
import pickle

from app.models.feature_extractor import extract_features


MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "phishing_model.pkl"


class HeuristicPhishingModel:
    """Rule-based fallback when sklearn model is unavailable."""

    def predict_proba(self, rows: list[list[float]]) -> list[list[float]]:
        results: list[list[float]] = []
        for row in rows:
            score = 0.05
            score += min(row[0] / 250, 0.12)      # url_length
            score += min(row[1] / 10, 0.08)        # dot_count
            score += min(row[2] / 6, 0.06)         # hyphen_count
            score += row[3] * 0.30                  # has_ip
            score += row[4] * 0.15                  # digit_ratio contribution
            score += row[5] * 0.15                  # has_shortener
            score += min(row[6] / 5, 0.08)         # subdomain_depth
            score += row[7] * 0.20                  # tld_risk
            score += min(row[8] / 6, 0.10)         # entropy
            score += min(row[9] / 6, 0.05)         # path_depth
            score += row[10] * 0.10                 # at_symbol
            score += row[11] * 0.12                 # double_slash
            score += row[12] * 0.10                 # hex_encoding
            phishing = max(0.01, min(score, 0.99))
            results.append([1 - phishing, phishing])
        return results

    def feature_importance(self, features: list[float]) -> list[tuple[str, float]]:
        """Return which features contributed most to the score."""
        names = [
            "url_length", "dot_count", "hyphen_count", "ip_address",
            "digit_ratio", "shortener", "subdomain_depth", "tld_risk",
            "domain_entropy", "path_depth", "at_symbol", "double_slash", "hex_encoding",
        ]
        weights = [0.12, 0.08, 0.06, 0.30, 0.15, 0.15, 0.08, 0.20, 0.10, 0.05, 0.10, 0.12, 0.10]
        contributions = [(names[i], features[i] * weights[i]) for i in range(len(features))]
        return sorted(contributions, key=lambda x: x[1], reverse=True)


def _load_model() -> HeuristicPhishingModel:
    if MODEL_PATH.exists():
        try:
            with MODEL_PATH.open("rb") as file:
                return pickle.load(file)
        except Exception:
            return HeuristicPhishingModel()
    return HeuristicPhishingModel()


MODEL = _load_model()


def predict_url_probability(url: str) -> float:
    features = extract_features(url)
    return float(MODEL.predict_proba([features])[0][1])


def predict_with_explanation(url: str) -> tuple[float, list[tuple[str, float]]]:
    """Return probability + feature importance explanation."""
    features = extract_features(url)
    prob = float(MODEL.predict_proba([features])[0][1])
    if hasattr(MODEL, "feature_importance"):
        importance = MODEL.feature_importance(features)
    else:
        importance = []
    return prob, importance
