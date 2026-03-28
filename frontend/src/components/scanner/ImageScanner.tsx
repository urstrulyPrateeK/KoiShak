import { ImagePlus, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ImageScanner({
  onDetect,
}: {
  onDetect: (payload: string) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const scanner = new Html5Qrcode("koishak-image-scanner-tmp");
      const result = await scanner.scanFile(file, true);
      scanner.clear();
      await onDetect(result);
    } catch {
      setError("No QR code found in this image. Try another photo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card p-5">
      <div id="koishak-image-scanner-tmp" className="hidden" />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/3 py-12 transition hover:border-teal/30 active:scale-[0.98]"
      >
        {loading ? (
          <LoaderCircle className="h-8 w-8 animate-spin text-teal" />
        ) : (
          <ImagePlus className="h-8 w-8 text-teal" />
        )}
        <span className="text-sm text-slate-300">
          {loading ? "Scanning image..." : "Tap to upload a QR screenshot"}
        </span>
        <span className="text-xs text-slate-500">PNG, JPG, or screenshot from gallery</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && (
        <div className="mt-3 rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs text-danger">
          {error}
        </div>
      )}
    </div>
  );
}
