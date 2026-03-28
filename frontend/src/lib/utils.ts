import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { HistoryItem, VerdictLabel, VerdictResult } from "../types";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export function verdictTone(verdict: VerdictLabel) {
  if (verdict === "SAFE") {
    return {
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
      glow: "shadow-success",
      progress: "from-emerald-400 to-emerald-500",
    };
  }
  if (verdict === "SUSPICIOUS") {
    return {
      badge: "bg-amber-500/15 text-amber-300 border-amber-400/30",
      glow: "shadow-[0_0_24px_rgba(251,191,36,0.15)]",
      progress: "from-amber-400 to-amber-500",
    };
  }
  return {
    badge: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    glow: "shadow-danger",
    progress: "from-rose-400 to-rose-500",
  };
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function truncatePayload(value: string, limit = 64) {
  return value.length <= limit ? value : `${value.slice(0, limit)}...`;
}

const HISTORY_KEY = "koishak.history";
const LAST_SCAN_KEY = "koishak.lastScan";

export function getStoredHistory(): HistoryItem[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
}

export function saveHistoryItem(result: VerdictResult) {
  const item: HistoryItem = {
    id: result.scan_id,
    payload: result.raw_payload,
    payload_type: result.payload_type,
    verdict: result.verdict,
    risk_score: result.risk_score,
    signals: result.signals,
    expanded_url: result.expanded_url,
    created_at: result.scanned_at,
  };
  const current = getStoredHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify([item, ...current].slice(0, 50)));
  localStorage.setItem(LAST_SCAN_KEY, JSON.stringify(result));
}

export function getLastScan(): VerdictResult | null {
  const raw = localStorage.getItem(LAST_SCAN_KEY);
  return raw ? (JSON.parse(raw) as VerdictResult) : null;
}
