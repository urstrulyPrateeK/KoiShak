import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import CameraScanner from "../components/scanner/CameraScanner";
import ImageScanner from "../components/scanner/ImageScanner";
import ManualInput from "../components/scanner/ManualInput";
import Badge from "../components/ui/Badge";
import { useQRScanner } from "../hooks/useQRScanner";
import { useVerdict } from "../hooks/useVerdict";

type ScanMode = "camera" | "manual" | "image";

export default function ScanPage() {
  const navigate = useNavigate();
  const { recentTypes, pushRecentType } = useQRScanner();
  const { analyze, loading, error } = useVerdict();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [scannerActive, setScannerActive] = useState(true);
  const [status, setStatus] = useState("Point camera at a QR code");

  const handleAnalyze = useCallback(
    async (payload: string) => {
      setScannerActive(false);
      setStatus("Analyzing QR safety...");
      const result = await analyze(payload);
      if (!result) {
        setStatus("Scan failed — try again");
        setScannerActive(true);
        return;
      }
      pushRecentType(result.payload_type);
      navigate("/verdict", { state: { result } });
    },
    [analyze, navigate, pushRecentType],
  );

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 p-1">
        {(["camera", "image", "manual"] as ScanMode[]).map((m) => (
          <button
            key={m}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-medium capitalize transition ${
              mode === m ? "bg-gradient-to-r from-teal to-violet text-white shadow-glow" : "text-slate-400"
            }`}
            onClick={() => { setMode(m); setScannerActive(true); }}
          >
            {m === "image" ? "Gallery" : m}
          </button>
        ))}
      </div>

      {/* Scanner area */}
      {mode === "camera" && (
        <CameraScanner onDetect={handleAnalyze} isActive={scannerActive} />
      )}
      {mode === "image" && <ImageScanner onDetect={handleAnalyze} />}
      {mode === "manual" && <ManualInput onSubmit={handleAnalyze} loading={loading} />}

      {/* Status bar */}
      <div className="surface-card flex items-center gap-3 p-4">
        <span className={`inline-flex h-2 w-2 rounded-full ${loading ? "animate-breathe bg-teal" : scannerActive ? "bg-teal" : "bg-slate-600"}`} />
        <span className="text-sm text-slate-300">{loading ? "Analyzing..." : status}</span>
      </div>

      {/* Scan again button when scanner stopped */}
      {!scannerActive && !loading && (
        <button
          onClick={() => { setScannerActive(true); setStatus("Point camera at a QR code"); }}
          className="w-full rounded-2xl bg-gradient-to-r from-teal to-violet py-3 text-sm font-semibold text-white shadow-glow transition active:scale-[0.98]"
        >
          Scan Again
        </button>
      )}

      {/* Recent types */}
      {recentTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recentTypes.map((type) => (
            <Badge key={type}>{type}</Badge>
          ))}
        </div>
      )}
      {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger">{error}</div>}
    </div>
  );
}
