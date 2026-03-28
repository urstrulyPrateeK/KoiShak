import { motion } from "framer-motion";
import { AlertTriangle, CreditCard, Link2, ShieldAlert, Wifi, MessageSquare, BookOpen } from "lucide-react";

const scamTypes = [
  {
    icon: Link2,
    title: "Phishing URLs",
    desc: "QR codes that redirect to fake login pages of banks, payment apps, or social media to steal your credentials.",
    color: "text-danger",
    example: "https://testsafebrowsing.appspot.com/s/phishing.html",
  },
  {
    icon: CreditCard,
    title: "UPI Collect Scams",
    desc: "Scammers share QR codes that trigger a collect request instead of letting you pay. You end up sending money to them.",
    color: "text-amber-400",
    example: "upi://pay?pa=scam999@fakebank&pn=RelianceJio&am=9999&tn=urgent claim",
  },
  {
    icon: Wifi,
    title: "Evil Twin Wi-Fi",
    desc: "QR codes that connect you to rogue Wi-Fi hotspots mimicking legitimate ones — all your traffic becomes visible.",
    color: "text-violet",
    example: "WIFI:T:nopass;S:Free_Airport_WiFi;P:;;",
  },
  {
    icon: MessageSquare,
    title: "SMS/Text Traps",
    desc: "QR codes that auto-compose SMS messages to premium-rate numbers or send your OTPs to attackers.",
    color: "text-teal",
    example: "smsto:+918000000000:Click http://bit.ly/claim-prize now",
  },
  {
    icon: ShieldAlert,
    title: "Shortened URL Masking",
    desc: "URL shorteners like bit.ly hide the true destination. The real link could be anything — malware, phishing, or worse.",
    color: "text-orange-400",
    example: "https://bit.ly/3example",
  },
  {
    icon: AlertTriangle,
    title: "Data Exfiltration",
    desc: "Carefully crafted QR payloads that embed your Aadhaar, PAN, or card numbers in query parameters sent to attacker servers.",
    color: "text-rose-400",
    example: "https://evil.site/collect?aadhaar=1234-5678-9012",
  },
];

export default function LearnPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-teal font-medium">Safety Academy</div>
        <h1 className="mt-1 text-2xl font-bold">Learn About QR Scams</h1>
        <p className="mt-1 text-xs text-slate-500">
          Know the tricks scammers use. Every scan type explained.
        </p>
      </div>

      <div className="space-y-3">
        {scamTypes.map(({ icon: Icon, title, desc, color, example }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-card p-5"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{desc}</p>
                <div className="mt-3 rounded-lg bg-black/30 p-2.5">
                  <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Example payload</div>
                  <code className="mono text-[11px] text-slate-400 break-all">{example}</code>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="surface-card-glow p-5 text-center">
        <BookOpen className="mx-auto h-6 w-6 text-teal" />
        <p className="mt-2 text-sm font-medium text-white">Always scan before you open.</p>
        <p className="mt-1 text-xs text-slate-500">
          KoiShak runs 11 payload classifiers + ML models to keep you safe, all before a single redirect.
        </p>
      </div>
    </div>
  );
}
