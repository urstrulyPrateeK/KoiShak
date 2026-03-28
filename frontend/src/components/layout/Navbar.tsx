import { NavLink } from "react-router-dom";

export default function Navbar() {
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
        <NavLink
          to="/scan"
          className="rounded-full bg-gradient-to-r from-teal to-violet px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:opacity-90 active:scale-95"
        >
          Scan QR
        </NavLink>
      </div>
    </header>
  );
}
