import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Layers,
  Sparkles,
  Target,
  Shield,
  Cpu,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { Link } from "react-router-dom";

const engineLayers = [
  {
    layer: "Layer 1",
    title: "Payload Classifier",
    icon: Eye,
    color: "text-teal",
    border: "border-teal/30",
    bg: "bg-teal/5",
    accent: "teal",
    description:
      "The first line of defense. Instantly classifies every raw QR payload into one of 11 distinct types using optimized regex pattern matching. No API calls, no latency — runs entirely on the server in microseconds.",
    details: [
      "Regex-based classification into 11 payload types (URL, UPI, Wi-Fi, SMS, Email, Tel, vCard, Geo, Calendar, Deep Links, Plain Text)",
      "Detects shortened URLs from 9+ known shortener domains (bit.ly, tinyurl.com, t.co, rb.gy, cutt.ly, etc.)",
      "Flags IP-address URLs — a common phishing tactic to bypass domain blocklists",
      "Detects homoglyph domain attacks using Unicode NFKC normalization (е vs e, а vs a)",
      "Identifies UPI collect-request vs. static QR patterns using parameter analysis",
      "Recognizes Android/iOS deep links and custom app intent schemes",
    ],
    output: "Payload type, subtype, flags (shortened, IP-based, homoglyph, collect-request)",
  },
  {
    layer: "Layer 2",
    title: "Type-Specific Validators",
    icon: Layers,
    color: "text-violet",
    border: "border-violet/30",
    bg: "bg-violet/5",
    accent: "violet",
    description:
      "Based on the classified type, the payload is routed to a specialised pipeline. Each pipeline runs domain-specific checks that understand the nuances of that payload format.",
    details: [
      "URL Pipeline → ML phishing model with 13 engineered features (url_length, dot_count, digit_ratio, IP detection, shortener detection, subdomain_depth, TLD risk, entropy, hex_encoding, etc.)",
      "URL Pipeline → VirusTotal integration (35% weight) — cross-references against 70+ antivirus engines",
      "URL Pipeline → Google Safe Browsing API (25% weight) — real-time threat check against Google's database",
      "URL Pipeline → Domain age check (15% weight) — newly registered domains under 30 days are flagged",
      "UPI Pipeline → VPA format validation + bank handle verification against 200+ trusted Indian bank handles",
      "Wi-Fi Pipeline → Open network detection, WEP deprecation check, evil-twin SSID pattern matching (\"free\", \"airport\", \"hotel\", \"bank\")",
      "SMS Pipeline → Premium-rate number detection + embedded URL extraction from message body",
      "Content Scanner → Cross-payload Aadhaar/PAN/card number exfiltration detection, brand impersonation, base64 encoding detection",
    ],
    output: "Array of typed signals, each with key, triggered status, human-readable detail, weight, and severity level",
  },
  {
    layer: "Layer 3",
    title: "Weighted Risk Scorer",
    icon: Target,
    color: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-500/5",
    accent: "amber-400",
    description:
      "All signals from Layer 2 are aggregated using a configurable weighted scoring system. Each signal type has a predefined weight based on its severity, and the final score determines the verdict.",
    details: [
      "URL signal weights: VirusTotal hits (35%), Safe Browsing match (25%), domain age < 30d (15%), shortened URL (10%), redirect depth > 2 (5%), homoglyph (5%), no HTTPS (3%), suspicious TLD (2%)",
      "UPI signal weights: invalid VPA format (40%), unknown bank handle (30%), amount preset (15%), high amount > ₹5000 (10%), suspicious note (10%), payee impersonation (8%), collect-request (5%)",
      "Default signal weights: unsafe open network (35%), unknown app intent (45%), premium-rate number (35%), embedded URL risk (35%), legacy encryption (25%)",
      "ML phishing probability is capped at 20% additional contribution to prevent false positives",
      "Final score = sum of triggered signal weights × 100, capped at 100",
    ],
    output: "Risk score (0–100) + verdict label (SAFE / SUSPICIOUS / DANGEROUS)",
  },
];

const urlWeights = [
  { signal: "VirusTotal hits", weight: "35%", severity: "danger" },
  { signal: "Safe Browsing match", weight: "25%", severity: "danger" },
  { signal: "Domain age < 30 days", weight: "15%", severity: "warning" },
  { signal: "Shortened URL", weight: "10%", severity: "warning" },
  { signal: "Redirect depth > 2", weight: "5%", severity: "info" },
  { signal: "Homoglyph domain", weight: "5%", severity: "warning" },
  { signal: "HTTPS missing", weight: "3%", severity: "info" },
  { signal: "Suspicious TLD", weight: "2%", severity: "info" },
];

const upiWeights = [
  { signal: "Invalid VPA format", weight: "40%", severity: "danger" },
  { signal: "Unknown bank handle", weight: "30%", severity: "danger" },
  { signal: "Amount preset", weight: "15%", severity: "warning" },
  { signal: "High amount (> ₹5000)", weight: "10%", severity: "danger" },
  { signal: "Suspicious note content", weight: "10%", severity: "warning" },
  { signal: "Payee impersonation", weight: "8%", severity: "warning" },
  { signal: "Collect-request pattern", weight: "5%", severity: "warning" },
];

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } },
};

function WeightTable({ title, icon: Icon, color, data }: { title: string; icon: React.ElementType; color: string; data: typeof urlWeights }) {
  return (
    <div className="surface-card p-5">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${color}`} />
        {title}
      </h3>
      <div className="space-y-1.5">
        {data.map(({ signal, weight, severity }) => (
          <div key={signal} className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2">
            <span className="text-xs text-slate-400">{signal}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-black/30 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    severity === "danger" ? "bg-rose-400" : severity === "warning" ? "bg-amber-400" : "bg-slate-500"
                  }`}
                  style={{ width: weight }}
                />
              </div>
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                severity === "danger"
                  ? "bg-rose-500/10 text-rose-400"
                  : severity === "warning"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-slate-500/10 text-slate-400"
              }`}>
                {weight}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SafetyEnginePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal transition mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet/10 p-3 text-violet">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">3-Layer Safety Engine</h1>
            <p className="text-sm text-slate-400 mt-0.5">How KoiShak analyzes every QR code</p>
          </div>
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="surface-card-glow p-5">
        <div className="flex items-start gap-3">
          <GitBranch className="h-5 w-5 text-violet flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-white">Analysis Pipeline Overview</h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Every QR scan passes through <span className="text-violet font-semibold">three sequential layers</span> of
              analysis. Each layer builds on the previous one, generating weighted signals that are aggregated into a
              final risk score. The entire pipeline completes in under 2 seconds.
            </p>
          </div>
        </div>

        {/* Visual pipeline flow */}
        <div className="mt-4 flex items-center gap-2 flex-wrap text-[11px]">
          <span className="rounded-lg bg-teal/10 text-teal px-3 py-1.5 font-medium flex items-center gap-1.5">
            <Eye className="h-3 w-3" /> Classify
          </span>
          <ArrowRight className="h-3 w-3 text-slate-600" />
          <span className="rounded-lg bg-violet/10 text-violet px-3 py-1.5 font-medium flex items-center gap-1.5">
            <Layers className="h-3 w-3" /> Validate
          </span>
          <ArrowRight className="h-3 w-3 text-slate-600" />
          <span className="rounded-lg bg-amber-500/10 text-amber-400 px-3 py-1.5 font-medium flex items-center gap-1.5">
            <Target className="h-3 w-3" /> Score
          </span>
          <ArrowRight className="h-3 w-3 text-slate-600" />
          <span className="rounded-lg bg-emerald-500/10 text-emerald-400 px-3 py-1.5 font-medium flex items-center gap-1.5">
            <Shield className="h-3 w-3" /> Verdict
          </span>
        </div>
      </div>

      {/* Engine layers - detailed */}
      <motion.div variants={anim.container} initial="hidden" animate="show" className="space-y-4">
        {engineLayers.map(({ layer, title, icon: Icon, color, border, bg, description, details, output }) => (
          <motion.div key={layer} variants={anim.item} className={`rounded-2xl ${bg} border ${border} p-5`}>
            {/* Layer header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-xl bg-black/20 p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{layer}</div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{description}</p>

            {/* Details list */}
            <div className="space-y-2 mb-4">
              {details.map((detail) => (
                <div key={detail} className="flex items-start gap-2.5 rounded-xl bg-black/15 p-3">
                  <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${color} opacity-70`} />
                  <span className="text-[11px] text-slate-400 leading-snug">{detail}</span>
                </div>
              ))}
            </div>

            {/* Output */}
            <div className="rounded-xl bg-black/30 p-3 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-slate-600 font-medium mb-1">Output →</div>
              <p className="text-[11px] text-slate-400 font-mono">{output}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Signal weight tables */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="h-4.5 w-4.5 text-violet" />
          Signal Weight Configuration
        </h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Each signal carries a configurable weight that determines its contribution to the final risk score.
          Higher-weight signals (like VirusTotal or invalid VPA) have more influence on the verdict.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WeightTable title="URL Signal Weights" icon={Cpu} color="text-teal" data={urlWeights} />
          <WeightTable title="UPI Signal Weights" icon={Cpu} color="text-amber-400" data={upiWeights} />
        </div>
      </div>

      {/* Risk thresholds */}
      <div className="surface-card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Risk Threshold Mapping</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-center">
            <div className="h-3 w-3 rounded-full bg-emerald-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-emerald-400">SAFE</div>
            <div className="text-[11px] text-slate-500 mt-1">Score 0 – 30</div>
            <p className="text-[10px] text-slate-600 mt-2">Low risk. Payload appears legitimate with no concerning signals detected.</p>
          </div>
          <div className="rounded-xl bg-amber-500/5 border border-amber-400/20 p-4 text-center">
            <div className="h-3 w-3 rounded-full bg-amber-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-amber-400">SUSPICIOUS</div>
            <div className="text-[11px] text-slate-500 mt-1">Score 31 – 60</div>
            <p className="text-[10px] text-slate-600 mt-2">Medium risk. Some concerning signals present. Proceed with caution.</p>
          </div>
          <div className="rounded-xl bg-rose-500/5 border border-rose-400/20 p-4 text-center">
            <div className="h-3 w-3 rounded-full bg-rose-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-rose-400">DANGEROUS</div>
            <div className="text-[11px] text-slate-500 mt-1">Score 61 – 100</div>
            <p className="text-[10px] text-slate-600 mt-2">High risk. Multiple danger signals triggered. Do not proceed.</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="surface-card p-5 text-center">
        <p className="text-sm font-medium text-white">See the engine in action</p>
        <p className="text-xs text-slate-500 mt-1">Scan any QR code and watch all 3 layers analyze it in real-time.</p>
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
