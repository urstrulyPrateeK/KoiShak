import { motion } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  CreditCard,
  Wifi,
  MessageSquare,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  Link2,
  Shield,
  Zap,
  Search,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const payloadTypes = [
  {
    type: "URL",
    icon: Globe,
    color: "text-teal",
    bg: "bg-teal/5",
    border: "border-teal/20",
    desc: "HTTP & HTTPS web links",
    detail: "Detected via regex pattern matching. URL payloads are the most common QR attack vector — they're analyzed through ML phishing detection (13 features), VirusTotal scanning, Google Safe Browsing API, domain age checks, and redirect chain expansion.",
    threats: ["Phishing login pages", "Malware downloads", "Redirect chains to scam sites", "Homoglyph domain attacks"],
  },
  {
    type: "UPI",
    icon: CreditCard,
    color: "text-amber-400",
    bg: "bg-amber-500/5",
    border: "border-amber-400/20",
    desc: "UPI payment intents (upi://pay?...)",
    detail: "Parses UPI deep links to extract VPA, amount, payee name, and transaction notes. Runs 7 offline fraud checks including VPA format validation, bank handle verification, and collect-request pattern detection.",
    threats: ["Collect-request scams", "Pre-filled high amounts", "Payee name impersonation", "Fake bank handles"],
  },
  {
    type: "Wi-Fi",
    icon: Wifi,
    color: "text-violet",
    bg: "bg-violet/5",
    border: "border-violet/20",
    desc: "Wi-Fi network configuration (WIFI:T:...)",
    detail: "Parses Wi-Fi QR payloads to extract SSID, encryption type, password hint, and hidden network flag. Detects open networks, deprecated WEP encryption, and evil-twin SSIDs mimicking public hotspots.",
    threats: ["Evil twin hotspots (Free_Airport_WiFi)", "Open networks with no encryption", "Deprecated WEP security", "Hidden rogue networks"],
  },
  {
    type: "SMS",
    icon: MessageSquare,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-400/20",
    desc: "Auto-composed text messages (smsto: / sms:)",
    detail: "Extracts target phone numbers and pre-filled message content. Checks for premium-rate numbers, embedded URLs in message body, and urgency/pressure language designed to trick users.",
    threats: ["Premium-rate number charges", "OTP forwarding to attackers", "Embedded phishing links", "Social engineering messages"],
  },
  {
    type: "Email",
    icon: Mail,
    color: "text-sky-400",
    bg: "bg-sky-500/5",
    border: "border-sky-400/20",
    desc: "Mailto links with pre-filled content",
    detail: "Parses mailto: URIs to extract recipient, subject, and body text. Scans for pre-filled phishing content, brand impersonation, embedded links, and sensitive data harvesting patterns.",
    threats: ["Pre-filled phishing emails", "Fake support email addresses", "Embedded malicious links", "Brand impersonation"],
  },
  {
    type: "Telephone",
    icon: Phone,
    color: "text-pink-400",
    bg: "bg-pink-500/5",
    border: "border-pink-400/20",
    desc: "Phone call triggers (tel:...)",
    detail: "Extracts phone numbers from tel: URIs. Checks against known premium-rate number prefixes and international toll patterns that could result in unexpected charges.",
    threats: ["Premium-rate number calls", "International toll fraud", "Vishing (voice phishing) setup", "Auto-dial to scam numbers"],
  },
  {
    type: "vCard",
    icon: FileText,
    color: "text-orange-400",
    bg: "bg-orange-500/5",
    border: "border-orange-400/20",
    desc: "Contact cards (BEGIN:VCARD)",
    detail: "Parses vCard payloads to extract name, phone, email, URLs, and notes. Detects impersonation of known brands/institutions and embedded malicious URLs within contact fields.",
    threats: ["Identity impersonation", "Embedded malicious URLs", "Fake bank contact details", "Social engineering setup"],
  },
  {
    type: "Geo",
    icon: MapPin,
    color: "text-lime-400",
    bg: "bg-lime-500/5",
    border: "border-lime-400/20",
    desc: "Geographic coordinates (geo:lat,lng)",
    detail: "Extracts latitude and longitude from geo: URIs. Could be used to lure victims to physical locations for scams or robberies. Currently analyzed for plausibility and contextual risk.",
    threats: ["Spoofed meeting locations", "Luring victims to unsafe areas", "Fake business addresses", "Coordinate manipulation"],
  },
  {
    type: "Calendar",
    icon: Calendar,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/5",
    border: "border-fuchsia-400/20",
    desc: "Calendar event invites (BEGIN:VCALENDAR)",
    detail: "Parses iCalendar data to extract event details, descriptions, and URLs. Scans event descriptions for phishing links, fake meeting invitations, and brand impersonation.",
    threats: ["Phishing links in event descriptions", "Fake meeting invitations", "Calendar spam injection", "Urgency-based social engineering"],
  },
  {
    type: "Deep Links",
    icon: Link2,
    color: "text-rose-400",
    bg: "bg-rose-500/5",
    border: "border-rose-400/20",
    desc: "App-specific intents (intent:// , custom://)",
    detail: "Detects non-standard URI schemes that trigger app-specific actions. These can invoke apps to perform unauthorized actions, exfiltrate data, or install malicious packages.",
    threats: ["Unauthorized app actions", "Data exfiltration via intents", "Triggering app vulnerabilities", "Silent app installation"],
  },
  {
    type: "Plain Text",
    icon: FileText,
    color: "text-slate-400",
    bg: "bg-slate-500/5",
    border: "border-slate-400/20",
    desc: "Raw text (fallback classifier)",
    detail: "Any payload that doesn't match the 10 structured types is classified as plain text. Still scanned for embedded sensitive data (Aadhaar, PAN, card numbers), urgency language, and scam patterns.",
    threats: ["Embedded sensitive data (Aadhaar, PAN)", "Scam pattern detection", "Base64-encoded hidden payloads", "Social engineering text"],
  },
];

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } },
};

export default function PayloadTypesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal transition mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal/10 p-3 text-teal">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">11 Payload Types</h1>
            <p className="text-sm text-slate-400 mt-0.5">Every QR code payload, classified & analyzed</p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="surface-card-glow p-5">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-white">How Classification Works</h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              When you scan a QR code, the first thing KoiShak does is classify the raw payload string into one
              of <span className="text-teal font-semibold">11 distinct types</span> using regex pattern matching.
              This happens <span className="text-white font-medium">instantly on the server</span> — zero API calls needed.
              Once classified, the payload is routed to a dedicated analysis pipeline with type-specific threat checks.
            </p>
          </div>
        </div>
      </div>

      {/* Classification flow */}
      <div className="surface-card p-5">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Search className="h-4 w-4 text-teal" />
          Classification Pipeline
        </h2>
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className="rounded-lg bg-teal/10 text-teal px-3 py-1.5 font-medium">Raw QR Payload</span>
          <ArrowRight className="h-3 w-3 text-slate-600" />
          <span className="rounded-lg bg-violet/10 text-violet px-3 py-1.5 font-medium">Regex Classifier</span>
          <ArrowRight className="h-3 w-3 text-slate-600" />
          <span className="rounded-lg bg-amber-500/10 text-amber-400 px-3 py-1.5 font-medium">Type-specific Pipeline</span>
          <ArrowRight className="h-3 w-3 text-slate-600" />
          <span className="rounded-lg bg-emerald-500/10 text-emerald-400 px-3 py-1.5 font-medium">Risk Signals</span>
        </div>
      </div>

      {/* All payload types */}
      <motion.div variants={anim.container} initial="hidden" animate="show" className="space-y-3">
        {payloadTypes.map(({ type, icon: Icon, color, bg, border, desc, detail, threats }, i) => (
          <motion.div key={type} variants={anim.item} className={`rounded-2xl ${bg} border ${border} p-5`}>
            <div className="flex items-start gap-3">
              <div className={`rounded-xl bg-black/20 p-2.5 ${color} flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-white">{type}</h3>
                  <span className="text-[10px] text-slate-600 font-mono">Type {String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">{detail}</p>

                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-600 font-medium mb-1.5">Threat Vectors</div>
                  <div className="flex flex-wrap gap-1.5">
                    {threats.map((t) => (
                      <span key={t} className="text-[10px] rounded-full bg-black/30 border border-white/5 px-2.5 py-1 text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <div className="surface-card p-5 text-center">
        <p className="text-sm font-medium text-white">Want to see it in action?</p>
        <p className="text-xs text-slate-500 mt-1">Scan a QR code and watch KoiShak classify & analyze it instantly.</p>
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
