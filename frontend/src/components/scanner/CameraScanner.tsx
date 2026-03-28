import { Camera, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

import ScanOverlay from "./ScanOverlay";

export default function CameraScanner({
  onDetect,
  isActive = true,
}: {
  onDetect: (payload: string) => Promise<void>;
  isActive?: boolean;
}) {
  const containerId = "koishak-qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Requesting camera...");

  useEffect(() => {
    if (!isActive) {
      const scanner = scannerRef.current;
      if (scanner) {
        try {
          if (scanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
            scanner.stop().then(() => {
              try { scanner.clear(); } catch { /* ignore */ }
            }).catch(() => {
              try { scanner.clear(); } catch { /* ignore */ }
            });
          } else {
            try { scanner.clear(); } catch { /* ignore */ }
          }
        } catch { /* ignore */ }
        scannerRef.current = null;
      }
      setReady(false);
      setStatus("Camera stopped");
      return;
    }

    let disposed = false;
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          if (disposed) return;
          disposed = true;
          setStatus("QR detected!");
          try {
            if (scanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
              await scanner.stop();
            }
          } catch { /* race condition */ }
          await onDetect(decodedText);
        },
        () => undefined,
      )
      .then(() => {
        if (!disposed) {
          setReady(true);
          setStatus("Point camera at a QR code");
        }
      })
      .catch(() => {
        if (!disposed) {
          setStatus("Camera unavailable — use Gallery or Manual mode");
        }
      });

    return () => {
      disposed = true;
      const current = scannerRef.current;
      if (current) {
        const cleanup = () => {
          try { current.clear(); } catch { /* ignore */ }
          scannerRef.current = null;
        };
        try {
          if (current.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
            current.stop().then(cleanup).catch(cleanup);
          } else {
            cleanup();
          }
        } catch {
          cleanup();
        }
      }
    };
  }, [isActive, onDetect]);

  return (
    <div className="surface-card overflow-hidden p-3">
      <div className="relative overflow-hidden rounded-2xl bg-black/60" style={{ minHeight: 300 }}>
        <div id={containerId} className="[&_video]:min-h-[300px] [&_video]:w-full [&_video]:object-cover" />
        {isActive && <ScanOverlay />}
        {!ready && isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50">
            <LoaderCircle className="h-6 w-6 animate-spin text-teal" />
            <p className="text-xs text-slate-300">{status}</p>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Camera className="h-3.5 w-3.5 text-teal" />
        {status}
      </div>
    </div>
  );
}
