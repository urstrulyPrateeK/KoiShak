import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger";
  }
>;

export default function GlowButton({
  children,
  className,
  variant = "primary",
  ...props
}: Props) {
  const variants = {
    primary:
      "bg-gradient-to-r from-teal to-violet text-white shadow-glow",
    ghost:
      "bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10",
    danger:
      "bg-danger/15 text-danger hover:bg-danger/20 border border-danger/30 shadow-danger",
  };

  return (
    <button
      className={cn(
        "rounded-xl px-5 py-3 text-sm font-medium transition duration-200 active:scale-95",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
