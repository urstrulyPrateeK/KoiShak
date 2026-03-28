import { useMemo, useState } from "react";

import type { HistoryItem, VerdictLabel } from "../types";
import { getStoredHistory } from "../lib/utils";

type FilterType = VerdictLabel | HistoryItem["payload_type"] | "ALL";

export function useScanHistory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");
  const history = getStoredHistory();

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchesFilter =
        filter === "ALL" ||
        item.verdict === filter ||
        item.payload_type === filter;
      const matchesSearch = item.payload.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, history, search]);

  return {
    history,
    filtered,
    search,
    setSearch,
    filter,
    setFilter,
  };
}
