import type { HistoryItem, VerdictLabel } from "../../types";
import HistoryCard from "./HistoryCard";

const filters: Array<{ label: string; value: "ALL" | VerdictLabel | HistoryItem["payload_type"] }> = [
  { label: "All", value: "ALL" },
  { label: "Safe", value: "SAFE" },
  { label: "Suspicious", value: "SUSPICIOUS" },
  { label: "Dangerous", value: "DANGEROUS" },
  { label: "URL", value: "URL" },
  { label: "UPI", value: "UPI" },
  { label: "WiFi", value: "WIFI" },
];

export default function ScanHistory({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  items,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filter: "ALL" | VerdictLabel | HistoryItem["payload_type"];
  onFilterChange: (value: "ALL" | VerdictLabel | HistoryItem["payload_type"]) => void;
  items: HistoryItem[];
}) {
  return (
    <div className="space-y-4">
      <div className="surface-card p-4">
        <input
          className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm outline-none focus:border-teal/30 transition"
          placeholder="Search payload content..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filters.map((opt) => (
            <button
              key={opt.value}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                filter === opt.value
                  ? "bg-gradient-to-r from-teal to-violet text-white"
                  : "border border-white/8 bg-white/3 text-slate-500"
              }`}
              onClick={() => onFilterChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <p className="text-center text-xs text-slate-600 py-10">No matching scans found.</p>
        )}
      </div>
    </div>
  );
}
