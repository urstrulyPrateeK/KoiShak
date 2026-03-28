import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { truncatePayload } from "../../lib/utils";
import type { HistoryItem } from "../../types";
import Badge from "../ui/Badge";

const colors = ["#06B6D4", "#7C3AED", "#10B981", "#FBBF24", "#FB7185"];

export default function RecentScans({ history }: { history: HistoryItem[] }) {
  const distribution = Object.entries(
    history.reduce<Record<string, number>>((acc, item) => {
      acc[item.payload_type] = (acc[item.payload_type] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      {distribution.length > 0 && (
        <div className="surface-card p-5">
          <div className="text-xs font-medium text-slate-400 mb-3">Payload Distribution</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75}>
                  {distribution.map((entry, i) => (
                    <Cell key={entry.name} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="surface-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium text-slate-400">Recent Scans</div>
          <div className="text-[10px] text-slate-600">Last 5</div>
        </div>
        <div className="space-y-2">
          {history.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/3 p-3">
              <div className="min-w-0">
                <div className="mono truncate text-xs text-slate-200">{truncatePayload(item.payload, 40)}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{item.payload_type}</div>
              </div>
              <Badge verdict={item.verdict}>{item.verdict}</Badge>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-center text-xs text-slate-600 py-6">No scans yet. Start scanning to see data here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
