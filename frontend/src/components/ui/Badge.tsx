import type { PropsWithChildren } from "react";

import { cn, verdictTone } from "../../lib/utils";
import type { VerdictLabel } from "../../types";

export default function Badge({
  children,
  verdict,
  className,
}: PropsWithChildren<{ verdict?: VerdictLabel; className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        verdict ? verdictTone(verdict).badge : "border-white/10 bg-white/5 text-slate-200",
        className,
      )}
    >
      {children}
    </span>
  );
}
