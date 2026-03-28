import { motion } from "framer-motion";

import { verdictTone } from "../../lib/utils";
import type { VerdictLabel } from "../../types";

export default function RiskMeter({
  score,
  verdict,
}: {
  score: number;
  verdict: VerdictLabel;
}) {
  const circumference = 188.5; // 2 * PI * 30
  const progress = circumference - (score / 100) * circumference;
  const tone = verdictTone(verdict);
  const color = verdict === "SAFE" ? "#10B981" : verdict === "SUSPICIOUS" ? "#FBBF24" : "#FB7185";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r="30" fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold">{score}</span>
        <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase ${tone.badge}`}>
          {verdict}
        </span>
      </div>
    </div>
  );
}
