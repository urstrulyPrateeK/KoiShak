import RecentScans from "../components/dashboard/RecentScans";
import StatCards from "../components/dashboard/StatCards";
import { getStoredHistory, truncatePayload } from "../lib/utils";

export default function DashboardPage() {
  const history = getStoredHistory();
  const mostDangerous = [...history].sort((a, b) => b.risk_score - a.risk_score)[0];

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-teal font-medium">Security Overview</div>
        <h1 className="mt-1 text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-xs text-slate-500">Track what KoiShak has blocked, flagged, and allowed.</p>
      </div>
      <StatCards history={history} />
      {mostDangerous && (
        <div className="surface-card p-5">
          <div className="text-[10px] uppercase tracking-widest text-slate-600">Most dangerous blocked</div>
          <div className="mono mt-2 text-sm font-semibold text-danger break-all">
            {truncatePayload(mostDangerous.payload, 80)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {mostDangerous.payload_type} scored {mostDangerous.risk_score}/100
          </div>
        </div>
      )}
      <RecentScans history={history} />
    </div>
  );
}
