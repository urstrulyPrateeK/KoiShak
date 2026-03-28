import ScanHistory from "../components/history/ScanHistory";
import { useScanHistory } from "../hooks/useScanHistory";

export default function HistoryPage() {
  const { filtered, filter, history, search, setFilter, setSearch } = useScanHistory();

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-teal font-medium">Audit Trail</div>
        <h1 className="mt-1 text-2xl font-bold">Scan History</h1>
        <p className="mt-1 text-xs text-slate-500">
          {history.length} scans stored locally on this device.
        </p>
      </div>
      <ScanHistory
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        items={filtered}
      />
    </div>
  );
}
