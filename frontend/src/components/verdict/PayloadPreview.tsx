import { Fragment } from "react";

import type { VerdictResult } from "../../types";

export default function PayloadPreview({ result }: { result: VerdictResult }) {
  const entries = Object.entries(result.payload_preview).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );

  if (entries.length === 0) return null;

  return (
    <div className="surface-card p-5">
      <div className="text-xs uppercase tracking-widest text-slate-500">Payload Details</div>
      <div className="mono mt-2 rounded-xl bg-black/30 p-3 text-xs text-slate-400 break-all">
        {result.raw_payload}
      </div>
      <div className="mt-4 space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-start gap-3 rounded-lg bg-white/3 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-600 w-24 shrink-0 pt-0.5">
              {key.replaceAll("_", " ")}
            </div>
            <div className="text-xs text-slate-300 break-all">
              {typeof value === "object" && value !== null ? (
                <pre className="whitespace-pre-wrap text-[11px] text-slate-400">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <Fragment>{String(value)}</Fragment>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
