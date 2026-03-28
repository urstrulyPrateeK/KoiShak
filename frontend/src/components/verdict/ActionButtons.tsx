import { ShieldX, Share2, ArrowRight } from "lucide-react";

import GlowButton from "../ui/GlowButton";

export default function ActionButtons({
  proceedTarget,
  onBlock,
}: {
  proceedTarget?: string | null;
  onBlock: () => void;
}) {
  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "KoiShak Verdict",
        text: "KoiShak analyzed a QR code before opening it.",
        url: window.location.href,
      });
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <GlowButton variant="danger" onClick={onBlock} className="inline-flex items-center justify-center gap-2 flex-1">
        <ShieldX className="h-4 w-4" />
        Block & Go Back
      </GlowButton>
      {proceedTarget && (
        <a
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal to-violet px-5 py-3 text-sm font-medium text-white shadow-glow transition active:scale-95"
          href={proceedTarget}
          target="_blank"
          rel="noreferrer"
        >
          <ArrowRight className="h-4 w-4" />
          I Understand, Proceed
        </a>
      )}
      <GlowButton variant="ghost" onClick={() => void handleShare()} className="inline-flex items-center justify-center gap-2 flex-1">
        <Share2 className="h-4 w-4" />
        Share
      </GlowButton>
    </div>
  );
}
