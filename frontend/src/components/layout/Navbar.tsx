import { Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

export default function Navbar() {
  const { canInstall, install } = useInstallPrompt();

  return (
    <header className="sticky top-0 z-20 border-b border-white/6 bg-ink/80 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/favicon.svg" alt="KoiShak" className="h-8 w-8" />
          <div>
            <div className="text-base font-semibold gradient-text">KoiShak</div>
            <div className="text-[10px] text-slate-500 tracking-wide">कोई शक? — Know Before You Open</div>
          </div>
        </NavLink>
        <div className="flex items-center gap-2">
          {canInstall && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-2 text-xs font-semibold text-teal transition hover:bg-teal/20 active:scale-95"
              title="Install KoiShak App"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Install</span>
              <span className="sm:hidden">App</span>
            </button>
          )}
          <NavLink
            to="/scan"
            className="rounded-full bg-gradient-to-r from-teal to-violet px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:opacity-90 active:scale-95"
          >
            Scan QR
          </NavLink>
        </div>
      </div>
    </header>
  );
}
