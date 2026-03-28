import { useState } from "react";
import { useNavigate } from "react-router-dom";

import GlowButton from "../components/ui/GlowButton";
import { useVerdict } from "../hooks/useVerdict";

export default function QuickCheckPage() {
  const [value, setValue] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const { analyze, loading, error } = useVerdict();
  const navigate = useNavigate();

  async function handleCheck() {
    const payload = value.trim();
    if (!payload) return;
    const result = await analyze(payload);
    if (result) {
      navigate("/verdict", { state: { result } });
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-teal font-medium">Quick Check</div>
        <h1 className="mt-1 text-2xl font-bold">URL & UPI Verifier</h1>
        <p className="mt-1 text-xs text-slate-500">
          Paste any URL, UPI address, or QR payload to verify safety instantly.
        </p>
      </div>

      <div className="surface-card p-5">
        <textarea
          className="mono min-h-28 w-full rounded-xl border border-white/8 bg-white/4 p-4 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-teal/40 transition"
          placeholder={batchMode
            ? "Paste one payload per line...\nhttps://example.com\nupi://pay?pa=merchant@okicici"
            : "https://suspicious-site.xyz or upi://pay?..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={batchMode}
              onChange={(e) => setBatchMode(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-teal focus:ring-teal"
            />
            Batch mode (multi-line)
          </label>
          <GlowButton disabled={!value.trim() || loading} onClick={handleCheck}>
            {loading ? "Checking..." : "Check Safety"}
          </GlowButton>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger">{error}</div>
      )}

      {/* Quick test payloads */}
      <div className="surface-card p-5">
        <div className="text-xs uppercase tracking-widest text-slate-600 mb-3">Try these test payloads</div>
        <div className="space-y-2">
          {[
            { label: "🔴 Phishing URL", payload: "https://testsafebrowsing.appspot.com/s/phishing.html" },
            { label: "🔴 Fake UPI", payload: "upi://pay?pa=scam999@fakebank&pn=RelianceJio&am=9999&tn=urgent claim" },
            { label: "🟡 Open WiFi", payload: "WIFI:T:nopass;S:Free_Airport_WiFi;P:;;" },
            { label: "🟢 Safe URL", payload: "https://google.com" },
            { label: "🟢 Safe UPI", payload: "upi://pay?pa=merchant@okicici&pn=Local Shop&cu=INR" },
          ].map(({ label, payload }) => (
            <button
              key={payload}
              onClick={() => setValue(payload)}
              className="flex w-full items-center gap-3 rounded-lg bg-white/3 px-3 py-2.5 text-left transition hover:bg-white/6 active:scale-[0.98]"
            >
              <span className="text-xs">{label}</span>
              <span className="mono flex-1 truncate text-[11px] text-slate-500">{payload}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
