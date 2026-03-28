import { useState } from "react";

export function useQRScanner() {
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [recentTypes, setRecentTypes] = useState<string[]>([]);

  function pushRecentType(next: string) {
    setRecentTypes((current) => [next, ...current.filter((item) => item !== next)].slice(0, 4));
  }

  return {
    mode,
    setMode,
    recentTypes,
    pushRecentType,
  };
}
