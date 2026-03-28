import { useState } from "react";

import GlowButton from "../ui/GlowButton";

export default function ManualInput({
  onSubmit,
  loading,
}: {
  onSubmit: (payload: string) => Promise<void>;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="surface-card p-5">
      <label className="mb-2 block text-xs font-medium text-slate-400 uppercase tracking-wider">
        Paste QR payload
      </label>
      <textarea
        className="mono min-h-28 w-full rounded-xl border border-white/8 bg-white/4 p-4 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-teal/40 transition"
        placeholder="https://bit.ly/example or upi://pay?..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="mt-3 flex justify-end">
        <GlowButton disabled={!value.trim() || loading} onClick={() => onSubmit(value.trim())}>
          {loading ? "Analyzing..." : "Analyze"}
        </GlowButton>
      </div>
    </div>
  );
}
