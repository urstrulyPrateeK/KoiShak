export default function ScanOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {/* Corner brackets */}
      <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-teal rounded-tl-lg" />
      <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-teal rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-teal rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-teal rounded-br-lg" />
      {/* Scan line */}
      <div className="absolute left-5 right-5 top-0 h-0.5 bg-gradient-to-r from-transparent via-teal to-transparent shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-scan" />
    </div>
  );
}
