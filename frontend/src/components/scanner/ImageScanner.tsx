import { ImagePlus, LoaderCircle, XCircle } from "lucide-react";
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
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      // Use a unique ID each time to avoid stale element issues
      const scannerId = "koishak-img-scan-" + Date.now();

      // Create a temporary container that is off-screen but rendered
      const tempDiv = document.createElement("div");
      tempDiv.id = scannerId;
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.width = "300px";
      tempDiv.style.height = "300px";
      tempDiv.style.overflow = "hidden";
      document.body.appendChild(tempDiv);

      try {
        const scanner = new Html5Qrcode(scannerId);
        const result = await scanner.scanFile(file, /* showImage */ false);
        try { scanner.clear(); } catch { /* ignore */ }
        await onDetect(result);
      } finally {
        // Clean up the temp div
        try { document.body.removeChild(tempDiv); } catch { /* ignore */ }
      }
    } catch {
      setError("No QR code found in this image. Try another photo.");
    } finally {
      setLoading(false);
    }
  }

  function clearPreview() {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setError(null);
  }

  return (
    <div className="surface-card p-5">
      {/* Preview area */}
      {preview && (
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/10">
          <img
            src={preview}
            alt="Uploaded QR"
            className="w-full max-h-64 object-contain bg-black/40"
          />
          {!loading && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-slate-300 transition hover:text-white"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50">
              <LoaderCircle className="h-8 w-8 animate-spin text-teal" />
              <span className="text-sm text-slate-300">Scanning for QR code...</span>
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/3 py-12 transition hover:border-teal/30 active:scale-[0.98]"
      >
        {loading && !preview ? (
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
          if (file) {
            clearPreview();
            handleFile(file);
          }
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
