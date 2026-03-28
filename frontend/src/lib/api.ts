import axios from "axios";

import type { HistoryItem, VerdictResult } from "../types";

// In production (served by backend), API is on same origin. In dev, use proxy or fallback.
const isProduction = !import.meta.env.DEV;
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const candidateApiUrls = isProduction
  ? [""]
  : configuredApiUrl
    ? [configuredApiUrl, "http://127.0.0.1:8000", "http://localhost:8000"]
    : ["http://127.0.0.1:8000", "http://localhost:8000"];

function makeClient(baseURL: string) {
  return axios.create({ baseURL, timeout: 15000 });
}

async function withApiFallback<T>(request: (client: ReturnType<typeof makeClient>) => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (const baseURL of candidateApiUrls) {
    try {
      return await request(makeClient(baseURL));
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error) && error.response) throw error;
    }
  }
  throw lastError;
}

export const api = {
  async scanPayload(payload: string) {
    return withApiFallback(async (client) => {
      const response = await client.post<VerdictResult>("/api/scan", { payload });
      return response.data;
    });
  },
  async scanBatch(payloads: string[]) {
    return withApiFallback(async (client) => {
      const response = await client.post<VerdictResult[]>("/api/scan/batch", { payloads });
      return response.data;
    });
  },
  async getHistory() {
    return withApiFallback(async (client) => {
      const response = await client.get<HistoryItem[]>("/api/history");
      return response.data;
    });
  },
};
