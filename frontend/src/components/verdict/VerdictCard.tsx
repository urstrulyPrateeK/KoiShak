import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

import { verdictTone } from "../../lib/utils";
import type { VerdictResult } from "../../types";
import Badge from "../ui/Badge";
import RiskMeter from "../ui/RiskMeter";

const iconMap = {
  SAFE: ShieldCheck,
  SUSPICIOUS: AlertTriangle,
  DANGEROUS: ShieldAlert,
} as const;

const bgMap = {
  SAFE: "from-emerald-500/8 to-transparent",
  SUSPICIOUS: "from-amber-500/8 to-transparent",
  DANGEROUS: "from-rose-500/8 to-transparent",
} as const;

export default function VerdictCard({ result }: { result: VerdictResult }) {
  const tone = verdictTone(result.verdict);
  const Icon = iconMap[result.verdict];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`surface-card overflow-hidden ${result.verdict === "DANGEROUS" ? "animate-pulseBorder" : ""}`}
    >
      {/* Gradient header */}
      <div className={`bg-gradient-to-b ${bgMap[result.verdict]} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`rounded-xl p-2.5 ${tone.badge}`}>
              <Icon className="h-6 w-6" />
            </span>
            <Badge verdict={result.verdict}>{result.verdict}</Badge>
          </div>
          <RiskMeter score={result.risk_score} verdict={result.verdict} />
        </div>

        <div className="mt-5">
          <div className="text-xs uppercase tracking-widest text-slate-500">Payload Type</div>
          <div className="mt-1 text-lg font-semibold text-white">{result.payload_type}</div>
        </div>

        <div className="mono mt-3 rounded-xl bg-black/30 p-3 text-xs text-slate-300 break-all leading-relaxed">
          {result.expanded_url ?? result.raw_payload}
        </div>
      </div>

      {/* Triggered signals summary */}
      <div className="p-5">
        <div className="text-sm font-semibold text-slate-200">Why this verdict?</div>
        <div className="mt-3 space-y-2">
          {result.signals.filter((s) => s.triggered).slice(0, 4).map((signal) => (
            <div key={signal.key} className="flex items-start gap-2 text-xs">
              <span className="mt-0.5 text-danger">✕</span>
              <span className="text-slate-400">{signal.detail}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-600">
          KoiShak inspected this with type-aware heuristics, APIs, and ML signals.
        </div>
      </div>
    </motion.section>
  );
}
