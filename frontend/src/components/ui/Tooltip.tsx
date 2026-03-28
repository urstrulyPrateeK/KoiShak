import type { PropsWithChildren } from "react";

export default function Tooltip({
  children,
  content,
}: PropsWithChildren<{ content: string }>) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 p-3 text-xs text-slate-300 shadow-xl group-hover:block">
        {content}
      </span>
    </span>
  );
}
