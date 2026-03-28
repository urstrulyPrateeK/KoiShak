import { useState } from "react";
import axios from "axios";

import { api } from "../lib/api";
import { saveHistoryItem } from "../lib/utils";
import type { VerdictResult } from "../types";

export function useVerdict() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(payload: string): Promise<VerdictResult | null> {
    setLoading(true);
    setError(null);
    try {
      const result = await api.scanPayload(payload);
      saveHistoryItem(result);
      return result;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = status
          ? `Scan failed with status ${status}. Check backend logs for details.`
          : "QRGuard could not reach the backend. Verify backend is running on port 8000.";
        setError(message);
      } else {
        setError("Scan failed unexpectedly. Please try again.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    analyze,
    loading,
    error,
  };
}
