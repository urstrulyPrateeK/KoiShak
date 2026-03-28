import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ActionButtons from "../components/verdict/ActionButtons";
import PayloadPreview from "../components/verdict/PayloadPreview";
import SignalBreakdown from "../components/verdict/SignalBreakdown";
import VerdictCard from "../components/verdict/VerdictCard";
import { getLastScan, getStoredHistory } from "../lib/utils";
import type { VerdictResult } from "../types";

const demoFallback: VerdictResult = {
  scan_id: "demo-scan",
  payload_type: "URL",
  payload_subtype: "shortened_url",
  raw_payload: "https://bit.ly/fake-bank-login",
  expanded_url: "http://fake-bank-login.xyz/secure",
  risk_score: 87,
  verdict: "DANGEROUS",
  scanned_at: new Date().toISOString(),
  payload_preview: {
    final_url: "http://fake-bank-login.xyz/secure",
    redirect_chain: ["bit.ly/fake-bank-login", "redir.cc/abc", "fake-bank-login.xyz/secure"],
  },
  signals: [
    { key: "virustotal_hits", triggered: true, detail: "12 engines flagged this URL", weight: 35, severity: "danger" },
    { key: "safe_browsing_match", triggered: true, detail: "Google Safe Browsing detected phishing", weight: 25, severity: "danger" },
    { key: "domain_age_under_30_days", triggered: true, detail: "Domain appears 2 days old", weight: 15, severity: "warning" },
    { key: "shortened_url_detected", triggered: true, detail: "Shortened URL hides the destination", weight: 10, severity: "warning" },
    { key: "redirect_chain_depth_gt_2", triggered: true, detail: "Redirect chain contains 3 hop(s)", weight: 5, severity: "warning" },
    { key: "ml_phishing_score", triggered: true, detail: "ML model estimates 94% phishing probability", weight: 19, severity: "danger" },
  ],
};

export default function VerdictPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = useMemo(() => {
    const routed = location.state as { result?: VerdictResult; historyId?: string } | null;
    if (routed?.result) return routed.result;
    if (routed?.historyId) {
      const match = getStoredHistory().find((item) => item.id === routed.historyId);
      if (match) {
        return {
          scan_id: match.id,
          payload_type: match.payload_type,
          payload_subtype: "history",
          raw_payload: match.payload,
          expanded_url: match.expanded_url,
          risk_score: match.risk_score,
          verdict: match.verdict,
          signals: match.signals,
          payload_preview: { source: "history" },
          scanned_at: match.created_at,
        } satisfies VerdictResult;
      }
    }
    return getLastScan() ?? demoFallback;
  }, [location.state]);

  return (
    <div className="space-y-4">
      <VerdictCard result={result} />
      <SignalBreakdown signals={result.signals} />
      <PayloadPreview result={result} />
      <ActionButtons
        proceedTarget={result.expanded_url ?? (result.payload_type === "URL" ? result.raw_payload : null)}
        onBlock={() => navigate("/scan")}
      />
    </div>
  );
}
