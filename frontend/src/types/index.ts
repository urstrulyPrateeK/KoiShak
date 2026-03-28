export type PayloadType =
  | "URL"
  | "UPI"
  | "WIFI"
  | "SMS"
  | "EMAIL"
  | "TEL"
  | "VCARD"
  | "GEO"
  | "CALENDAR"
  | "INTENT"
  | "TEXT";

export type VerdictLabel = "SAFE" | "SUSPICIOUS" | "DANGEROUS";

export interface Signal {
  key: string;
  triggered: boolean;
  detail: string;
  weight: number;
  severity: string;
}

export interface VerdictResult {
  scan_id: string;
  payload_type: PayloadType;
  payload_subtype: string;
  raw_payload: string;
  expanded_url?: string | null;
  risk_score: number;
  verdict: VerdictLabel;
  signals: Signal[];
  payload_preview: Record<string, unknown>;
  scanned_at: string;
}

export interface HistoryItem {
  id: string;
  payload: string;
  payload_type: PayloadType;
  verdict: VerdictLabel;
  risk_score: number;
  signals: Signal[];
  expanded_url?: string | null;
  created_at: string;
}

export interface ScanRequest {
  payload: string;
}
