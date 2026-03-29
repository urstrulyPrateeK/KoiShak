import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  WalletCards,
  ShieldCheck,
  IndianRupee,
  UserX,
  FileWarning,
  Database,
  Fingerprint,
  BadgeAlert,
  Ban,
} from "lucide-react";
import { Link } from "react-router-dom";

const upiChecks = [
  {
    check: "Invalid VPA Format",
    weight: 40,
    icon: XCircle,
    severity: "danger",
    desc: "Validates that the UPI address follows the standard user@bank format using a strict regex pattern. Malformed VPAs — like missing @ symbols, special characters, or impossibly short handles — are a strong indicator of fraudulent or auto-generated QR codes.",
    example: {
      safe: "prateek@okaxis",
      danger: "sc@m!@fakebank",
    },
  },
  {
    check: "Unknown Bank Handle",
    weight: 30,
    icon: BadgeAlert,
    severity: "danger",
    desc: "Cross-checks the @handle portion of the VPA against a curated database of 200+ verified Indian bank and PSP UPI handles. Unrecognized handles like @fakebank or @scampay are immediately flagged as suspicious — legitimate banks always use their registered handle.",
    example: {
      safe: "@ybl, @paytm, @okaxis, @okhdfcbank",
      danger: "@fakebank, @unknown123, @scampay",
    },
  },
  {
    check: "Amount Preset",
    weight: 15,
    icon: IndianRupee,
    severity: "warning",
    desc: "Detects when a QR code has a pre-filled payment amount in the 'am' parameter. While some legitimate merchant QRs include amounts, scammers frequently lock in specific amounts to prevent victims from noticing the charge before it processes.",
    example: {
      safe: "No 'am' parameter (user enters amount)",
      danger: "am=9999 (amount locked to ₹9,999)",
    },
  },
  {
    check: "Suspicious Note Content",
    weight: 10,
    icon: FileWarning,
    severity: "warning",
    desc: "Scans the transaction note ('tn' parameter) for urgency and pressure words commonly used in scams: \"urgent\", \"immediately\", \"reward\", \"prize\", \"claim\", \"verify\", \"limited\". Also flags notes containing embedded HTTP links — a major red flag in UPI transactions.",
    example: {
      safe: "tn=Coffee payment",
      danger: "tn=URGENT claim your reward http://bit.ly/scam",
    },
  },
  {
    check: "High Amount Preset",
    weight: 10,
    icon: AlertTriangle,
    severity: "danger",
    desc: "Flags QR codes with preset amounts exceeding ₹5,000. High-value preset amounts are disproportionately common in UPI scam QR codes, where attackers set large amounts hoping victims won't notice before confirming.",
    example: {
      safe: "am=150 (₹150 — typical merchant)",
      danger: "am=49999 (₹49,999 — suspiciously high)",
    },
  },
  {
    check: "Payee Impersonation",
    weight: 8,
    icon: UserX,
    severity: "warning",
    desc: "Detects payee names ('pn' parameter) that mimic banks (SBI, HDFC, Axis, ICICI), telecom brands (Jio), or government entities (GST, Income Tax, Government). Scammers frequently use these names to create false trust and urgency.",
    example: {
      safe: "pn=Prateek's Shop",
      danger: "pn=SBI Refund Dept, pn=Income Tax Verification",
    },
  },
  {
    check: "Collect Request Pattern",
    weight: 5,
    icon: Ban,
    severity: "warning",
    desc: "Identifies collect-request QR codes — the #1 UPI scam vector in India. A collect request is detected when the QR has a transaction reference ('tr') and a preset amount ('am') but no merchant category code ('mc'). Instead of you paying, a collect request pulls money from your account.",
    example: {
      safe: "Standard pay QR: pa=shop@upi&am=500&mc=5411",
      danger: "Collect QR: pa=scam@upi&am=9999&tr=REF123 (no mc)",
    },
  },
];

const bankHandleSamples = [
  "@ybl", "@paytm", "@okaxis", "@okhdfcbank", "@oksbi",
  "@ibl", "@upi", "@axl", "@sbi", "@icici",
  "@hdfcbank", "@kotak", "@indus", "@federal", "@rbl",
  "@pnb", "@boi", "@cbin", "@barb", "@unionbank",
];

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } },
  item: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } },
};

export default function UpiDetectionPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal transition mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
            <WalletCards className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">UPI Fraud Detection</h1>
            <p className="text-sm text-slate-400 mt-0.5">India-first, zero-API, offline UPI safety checks</p>
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div className="surface-card-glow p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-amber-400">₹1,087 Cr</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Annual UPI fraud losses in India</div>
          </div>
          <div>
            <div className="text-xl font-bold text-teal">7</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Offline checks per scan</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">0</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">External API calls needed</div>
          </div>
        </div>
      </div>

      {/* How UPI QR works */}
      <div className="surface-card p-5">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-amber-400" />
          How a UPI QR Code Works
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          A UPI QR code encodes a deep link like <code className="mono text-[11px] text-amber-400/80 bg-black/30 px-1.5 py-0.5 rounded">upi://pay?pa=user@bank&pn=Name&am=100&tn=Note</code>.
          KoiShak parses every parameter and runs 7 independent safety checks — all offline, with zero network latency.
        </p>

        {/* Parameter breakdown */}
        <div className="rounded-xl bg-black/20 p-4 border border-white/5">
          <div className="text-[10px] uppercase tracking-wider text-slate-600 font-medium mb-2">UPI Payload Parameters</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { param: "pa", label: "Payee VPA", example: "shop@okaxis" },
              { param: "pn", label: "Payee Name", example: "Coffee Shop" },
              { param: "am", label: "Amount", example: "150.00" },
              { param: "tn", label: "Transaction Note", example: "Coffee payment" },
              { param: "cu", label: "Currency", example: "INR" },
              { param: "tr", label: "Transaction Ref", example: "TXN123456" },
            ].map(({ param, label, example }) => (
              <div key={param} className="rounded-lg bg-black/20 p-2.5">
                <div className="text-[10px] font-mono text-amber-400 font-medium">{param}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
                <div className="text-[10px] text-slate-600 mt-0.5 font-mono">{example}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All 7 checks - detailed */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1">7 Fraud Detection Checks</h2>
        <p className="text-xs text-slate-500 mb-4">Each check generates a weighted signal that feeds into the risk score.</p>
      </div>

      <motion.div variants={anim.container} initial="hidden" animate="show" className="space-y-3">
        {upiChecks.map(({ check, weight, icon: Icon, severity, desc, example }) => (
          <motion.div
            key={check}
            variants={anim.item}
            className={`rounded-2xl border p-5 ${
              severity === "danger"
                ? "bg-rose-500/3 border-rose-400/15"
                : "bg-amber-500/3 border-amber-400/15"
            }`}
          >
            {/* Check header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Icon className={`h-5 w-5 ${severity === "danger" ? "text-rose-400" : "text-amber-400"}`} />
                <h3 className="text-sm font-semibold text-white">{check}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-wider font-medium ${
                  severity === "danger" ? "text-rose-400" : "text-amber-400"
                }`}>
                  {severity}
                </span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                  severity === "danger"
                    ? "bg-rose-500/10 text-rose-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}>
                  {weight}%
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>

            {/* Examples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium">Safe Example</span>
                </div>
                <code className="mono text-[10px] text-slate-400 break-all">{example.safe}</code>
              </div>
              <div className="rounded-xl bg-rose-500/5 border border-rose-400/10 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <XCircle className="h-3 w-3 text-rose-400" />
                  <span className="text-[10px] uppercase tracking-wider text-rose-400 font-medium">Flagged Example</span>
                </div>
                <code className="mono text-[10px] text-slate-400 break-all">{example.danger}</code>
              </div>
            </div>

            {/* Weight bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] text-slate-600">Weight</span>
              <div className="flex-1 h-1.5 rounded-full bg-black/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weight}%` }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${severity === "danger" ? "bg-rose-400" : "bg-amber-400"}`}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500">{weight}%</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bank handles database */}
      <div className="surface-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Verified Bank Handle Database</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          KoiShak maintains a curated list of <span className="text-white font-medium">200+ verified Indian bank UPI handles</span>.
          Every UPI QR scan cross-references the payee's @handle against this database. Unknown handles are immediately flagged.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {bankHandleSamples.map((handle) => (
            <span key={handle} className="text-[10px] font-mono rounded-full bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1 text-emerald-400">
              {handle}
            </span>
          ))}
          <span className="text-[10px] rounded-full bg-black/20 border border-white/5 px-2.5 py-1 text-slate-500">
            +180 more
          </span>
        </div>
      </div>

      {/* Key differentiator */}
      <div className="surface-card-glow p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-white">Why Zero API Calls Matter</h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Unlike URL analysis which can use VirusTotal or Safe Browsing APIs, UPI fraud detection in KoiShak is
              <span className="text-amber-400 font-semibold"> 100% offline</span>. All 7 checks run locally on the server
              using regex validation, curated databases, and heuristic rules. This means:
            </p>
            <ul className="mt-2 space-y-1.5">
              {[
                "Zero network latency — results appear instantly",
                "No API rate limits or costs",
                "Works even when external services are down",
                "No user data is sent to third-party services",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-amber-400 opacity-60" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="surface-card p-5 text-center">
        <p className="text-sm font-medium text-white">Test UPI fraud detection</p>
        <p className="text-xs text-slate-500 mt-1">Scan a UPI QR code and watch all 7 checks run in real-time.</p>
        <Link
          to="/scan"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-violet px-5 py-2.5 text-xs font-semibold text-white shadow-glow transition hover:opacity-90 active:scale-95"
        >
          Start Scanning <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
