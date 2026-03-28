import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

import type { Signal } from "../../types";

export default function SignalBreakdown({ signals }: { signals: Signal[] }) {
  const [expanded, setExpanded] = useState(false);
  const passed = signals.filter((s) => !s.triggered).length;
  const visible = expanded ? signals : signals.slice(0, 4);

  return (
    <div className="surface-card p-5">
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <h3 className="text-sm font-semibold text-white">Signal Breakdown</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {passed}/{signals.length} checks passed
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition ${expanded ? "rotate-180" : ""}`} />
      </button>
      <div className="mt-3 space-y-2">
        {visible.map((signal, i) => (
          <motion.div
            key={signal.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2.5 rounded-xl bg-white/3 p-3"
          >
            {signal.triggered ? (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-200 capitalize">
                {signal.key.replaceAll("_", " ")}
              </div>
              <div className="mt-0.5 text-xs text-slate-500 leading-relaxed">{signal.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
