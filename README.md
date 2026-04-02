# KoiShak — India's First QR Firewall

> **कोई शक? — Know Before You Open**

KoiShak is a multi-layer QR code safety firewall that scans any QR code, classifies its payload type (URL, UPI, Wi-Fi, SMS, Email, vCard, and more), runs type-specific safety checks using ML models + custom heuristics + free APIs, and returns a clear verdict — **before you open anything**.

## Features

### 🛡️ 3-Layer Safety Engine
1. **Payload Classifier** — Identifies 11 QR payload types using regex + schema matching
2. **Type-Specific Pipelines** — Custom validators per payload type (UPI runs 7 fraud checks with zero API calls)
3. **Risk Scoring Engine** — Weighted multi-signal aggregation producing a 0–100 risk score

### 🤖 Offline ML Intelligence
- Trained phishing URL classifier (RandomForest / heuristic fallback)
- Shannon entropy analysis for obfuscation detection
- Scam pattern recognition (lottery, KYC phishing, account scare tactics)
- Sensitive data exfiltration detection (Aadhaar, PAN, card numbers)
- Brand impersonation detection

### 📱 Mobile-First PWA
- Installable on Android/iOS home screen
- Camera, gallery upload, and manual paste scan modes
- Offline-capable (cached assets + local history)
- Bottom tab navigation, optimized touch targets

### 🔍 Payload Types Supported
URL · UPI · Wi-Fi · SMS · Email · Telephone · vCard · Geo · Calendar · Deep Links · Plain Text

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite + TailwindCSS |
| Backend | Python FastAPI + uvicorn |
| ML | scikit-learn + custom heuristic models |
| APIs | VirusTotal, Google Safe Browsing, IPQualityScore, WHOIS |
| Storage | localStorage (client) + Supabase (optional) |
| Deploy | Render (monorepo: backend serves frontend) |

## Quick Start

### Local Development

```bash
# Backend
cd backend
python -m venv .venv
.venv/Scripts/activate  # or source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Deploy to Render
1. Push to GitHub
2. Connect to Render
3. Set environment variables (see `.env.example`)
4. Build command: `bash build.sh`
5. Start command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Demo QR Codes

| Type | Payload | Expected |
|------|---------|----------|
| 🔴 Phishing | `https://testsafebrowsing.appspot.com/s/phishing.html` | DANGEROUS |
| 🔴 UPI Scam | `upi://pay?pa=scam999@fakebank&pn=RelianceJio&am=9999&tn=urgent claim` | DANGEROUS |
| 🟡 Shortened URL | `https://bit.ly/3example` | SUSPICIOUS |
| 🟡 Open WiFi | `WIFI:T:nopass;S:Free_Airport_WiFi;P:;;` | SUSPICIOUS |
| 🟢 Safe URL | `https://google.com` | SAFE |
| 🟢 Safe UPI | `upi://pay?pa=merchant@okicici&pn=Local Shop&cu=INR` | SAFE |

## License

MIT


## Contributors

- **Chhavi Gautam** - Presentation & Demo Lead
