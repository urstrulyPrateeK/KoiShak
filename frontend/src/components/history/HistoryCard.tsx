import { Link } from "react-router-dom";

import { formatDate, truncatePayload } from "../../lib/utils";
import type { HistoryItem } from "../../types";
import Badge from "../ui/Badge";
import TypeIcon from "../ui/TypeIcon";

export default function HistoryCard({ item }: { item: HistoryItem }) {
  return (
    <Link
      to="/verdict"
      state={{ historyId: item.id }}
      className="surface-card block p-4 transition hover:border-teal/15 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <span className="rounded-xl bg-white/5 p-2.5 text-slate-400 shrink-0">
            <TypeIcon type={item.payload_type} className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="mono truncate text-xs text-slate-200">{truncatePayload(item.payload, 50)}</div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
              <span>{item.payload_type}</span>
              <span>•</span>
              <span>Risk {item.risk_score}</span>
              <span>•</span>
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>
        </div>
        <Badge verdict={item.verdict}>{item.verdict}</Badge>
      </div>
    </Link>
  );
}
