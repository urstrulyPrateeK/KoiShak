import { ShieldAlert, ShieldCheck, ShieldX, ScanLine } from "lucide-react";

import type { HistoryItem } from "../../types";

export default function StatCards({ history }: { history: HistoryItem[] }) {
  const safe = history.filter((i) => i.verdict === "SAFE").length;
  const suspicious = history.filter((i) => i.verdict === "SUSPICIOUS").length;
  const dangerous = history.filter((i) => i.verdict === "DANGEROUS").length;

  const cards = [
    { label: "Total scans", value: history.length, icon: ScanLine, tone: "text-teal" },
    { label: "Safe", value: safe, icon: ShieldCheck, tone: "text-emerald-400" },
    { label: "Suspicious", value: suspicious, icon: ShieldAlert, tone: "text-amber-400" },
    { label: "Blocked", value: dangerous, icon: ShieldX, tone: "text-danger" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="surface-card p-4">
          <div className="flex items-center justify-between">
            <Icon className={`h-5 w-5 ${tone}`} />
          </div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
          <div className="text-[11px] text-slate-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
