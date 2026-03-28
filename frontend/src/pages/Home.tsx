import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Shield, Sparkles, WalletCards, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "11 Payload Types",
    desc: "URL, UPI, Wi-Fi, SMS, Email, vCard, Geo, Calendar, Deep Links & more",
    icon: Shield,
    color: "from-teal/20 to-teal/5 border-teal/20 text-teal",
  },
  {
    title: "3-Layer Safety Engine",
    desc: "Classifier → Type-specific validators → Weighted risk scoring",
    icon: Sparkles,
    color: "from-violet/20 to-violet/5 border-violet/20 text-violet",
  },
  {
    title: "UPI Fraud Detection",
    desc: "India-first collect-request & preset-amount checks — zero API calls",
    icon: WalletCards,
    color: "from-amber-500/20 to-amber-500/5 border-amber-400/20 text-amber-400",
  },
];

const quickLinks = [
  { to: "/learn", label: "Safety Academy", icon: BookOpen, desc: "Learn about QR scam types" },
  { to: "/quickcheck", label: "Quick Check", icon: Zap, desc: "Paste & verify URLs instantly" },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-surface to-ink p-6 sm:p-10"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal/8 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet/8 blur-3xl" />

        <div className="relative text-center">
          <motion.img
            src="/favicon.svg"
            alt="KoiShak"
            className="mx-auto h-20 w-20 animate-float"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-sm font-medium text-teal tracking-widest uppercase"
          >
            India&apos;s First QR Firewall
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-3xl font-bold leading-tight text-white sm:text-5xl"
          >
            कोई शक?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-3 max-w-md text-sm text-slate-400 sm:text-base"
          >
            KoiShak analyzes every QR code payload before you visit, pay, or connect.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-violet px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 active:scale-95"
            >
              Start Scanning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 active:scale-95"
            >
              Learn About Scams
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature cards */}
      <section className="grid gap-3 sm:grid-cols-3">
        {features.map(({ title, desc, icon: Icon, color }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className={`rounded-2xl border bg-gradient-to-b p-5 ${color}`}
          >
            <Icon className="h-6 w-6" />
            <h2 className="mt-3 text-base font-semibold text-white">{title}</h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Quick links */}
      <section className="grid gap-3 sm:grid-cols-2">
        {quickLinks.map(({ to, label, icon: Icon, desc }) => (
          <Link key={to} to={to} className="surface-card flex items-center gap-4 p-4 transition hover:border-teal/20 active:scale-[0.98]">
            <span className="rounded-xl bg-teal/10 p-3 text-teal">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">{label}</div>
              <div className="text-xs text-slate-500">{desc}</div>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-slate-600" />
          </Link>
        ))}
      </section>
    </div>
  );
}
