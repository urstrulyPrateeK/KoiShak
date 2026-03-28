# KoiShak — Complete Overhaul Plan

Comprehensive plan to transform QRGuard into **KoiShak** — a hackathon-winning, mobile-first PWA with premium UI, robust scanning, offline ML capabilities, and deployment-ready architecture.

## User Review Required

> [!IMPORTANT]
> **Branding**: Renaming everything from "QRGuard" to "KoiShak" (कोईशक — "Any Doubt?"). The logo will be a custom SVG: a shield with a QR code pattern and a magnifying glass. Please confirm you're happy with this name/branding direction.

> [!IMPORTANT]
> **Deployment Architecture**: The plan uses a monorepo approach where the FastAPI backend serves the built React frontend as static files. This means **one Render deployment** (a single Python web service). The Vite dev server stays for local development. Is this acceptable?

> [!WARNING]
> **Supabase dependency removed**: Currently the app imports supabase-js but doesn't meaningfully use it. I'll remove the Supabase dependency to simplify deployment and reduce bundle size. History is stored in localStorage on the client + in-memory on the server. If you want Supabase persistence later, it can be re-added. Confirm?

> [!IMPORTANT]
> **TailwindCSS**: The existing app uses Tailwind v3. Since the codebase is already built on Tailwind and there are ~40 files using it, I'll keep Tailwind but significantly customize the design tokens and components to make it look human-designed and premium. Ripping Tailwind out would be a massive regression risk for a hackathon deadline.

---

## Proposed Changes

Changes are grouped by component, in execution order.

---

### 1. Camera Lifecycle Fix (Critical Bug)

The camera currently starts when mounting `/scan` but **never fully stops** after navigation. The `onDetect` callback stops scanning but the video stream may persist.

#### [MODIFY] [CameraScanner.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/scanner/CameraScanner.tsx)
- Add explicit `stopCamera()` method exposed via ref or callback
- Camera only initializes when `isActive` prop is true
- After scan detection → stop camera → navigate away
- On component unmount → fully release media stream tracks
- Add error boundary for camera permission failures on mobile

#### [MODIFY] [Scan.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/Scan.tsx)
- Pass `isScanning` state to CameraScanner
- Set `isScanning=false` once scan result is received
- Camera only runs between "Start Scan" button press and result receipt

---

### 2. Complete Rebranding: QRGuard → KoiShak

Every file referencing "QRGuard" gets updated.

#### Files to modify (name/text changes):
- [index.html](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/index.html) — `<title>`, meta description
- [manifest.json](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/public/manifest.json) — name, short_name
- [sw.js](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/public/sw.js) — cache name
- [Navbar.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/layout/Navbar.tsx) — "QRGuard" → "KoiShak"
- [Sidebar.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/layout/Sidebar.tsx) — "QR Firewall" → "KoiShak"
- [Footer.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/layout/Footer.tsx) — footer text
- [Home.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/Home.tsx) — hero text
- [VerdictCard.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/verdict/VerdictCard.tsx) — "QRGuard" mentions
- [Dashboard.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/Dashboard.tsx) — "QRGuard" mentions
- [ActionButtons.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/verdict/ActionButtons.tsx) — share text
- [SignalBreakdown.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/verdict/SignalBreakdown.tsx) — "QRGuard" mentions
- [utils.ts](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/lib/utils.ts) — localStorage keys
- [package.json](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/package.json) — package name
- [main.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/main.py) — FastAPI title
- [safe_browsing.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/services/safe_browsing.py) — client ID
- [README.md](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/README.md) — full rewrite
- [QRGUARD_BUILD_PROMPT.md](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/QRGUARD_BUILD_PROMPT.md) — delete or rename

#### [NEW] [favicon.svg](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/public/favicon.svg) (overwrite)
- New KoiShak logo: Shield outline with embedded QR pattern dots, magnifying glass accent, using the app's teal-violet color palette
- Will also be used as PWA icon

---

### 3. Premium Mobile-First UI Overhaul

The current design is dark-theme-card-based (looks AI-generated). The overhaul shifts to a **warm, human, mobile-first layout** while keeping the dark premium feel but making it distinctive.

**Design Philosophy Changes:**
- Remove desktop sidebar entirely (wastes space on mobile, looks generic)
- Mobile bottom tab bar navigation (like native apps)
- Warmer color palette: shift from pure violet to a **teal-to-violet gradient** accent
- Rounded, breathing micro-animations
- Full-bleed mobile layouts with proper safe areas
- Home page redesigned for mobile-first: scan button front and center
- Softer card borders, more organic shapes
- Add subtle mesh gradient backgrounds instead of flat dark

#### [MODIFY] [tailwind.config.ts](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/tailwind.config.ts)
- New color tokens: `accent` (teal-violet gradient endpoints), `surface-warm`, etc.
- New spacing/sizing for mobile-first components
- New animations: `shimmer`, `breathe`, `slideUp`
- Safe area insets for PWA

#### [MODIFY] [index.css](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/index.css)
- Mesh gradient backgrounds
- Mobile viewport handling (100dvh)
- Bottom tab bar styles
- Smoother scrolling, touch overscroll behavior
- Custom scrollbar hiding on mobile
- New CSS custom properties for the updated palette

#### [DELETE] [Sidebar.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/layout/Sidebar.tsx)
- Desktop sidebar removed; navigation moves to bottom tab bar

#### [MODIFY] [Navbar.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/layout/Navbar.tsx)
- Simplified top bar with logo + optional action button
- No navigation links in navbar (they're in the bottom bar now)

#### [NEW] [BottomNav.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/components/layout/BottomNav.tsx)
- Mobile-first bottom tab bar with 4 tabs: Home, Scan, History, Dashboard
- Active tab indicator with gradient underline animation
- Glassmorphism backdrop
- Safe area padding for notch/home indicator devices

#### [MODIFY] [App.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/App.tsx)
- Remove Sidebar, add BottomNav
- Adjust Shell layout for mobile-first
- Add proper page transition animations

#### [MODIFY] [Home.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/Home.tsx)
- Complete redesign: 
  - Large animated KoiShak logo at top
  - "कोई शक?" tagline with Hindi text
  - Single prominent "Scan Now" circular button
  - Quick-access cards for recent scan types
  - Feature highlights as horizontal scroll cards (mobile-friendly)
  - Safety stats (threats blocked) as animated counters

#### [MODIFY] [Scan.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/Scan.tsx)
- Full-screen camera experience (edge-to-edge on mobile)
- Floating mode toggle (camera/paste) as pill buttons
- Animated scan corners with breathing glow
- Better loading states with scan progress animation

#### [MODIFY] [Verdict.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/Verdict.tsx)
- Full-screen verdict reveal animation
- Color-coded gradient background matching verdict
- Prominent risk meter centered at top
- Collapsible signal sections for mobile readability

#### [MODIFY] All other page/component files
- Update design tokens, spacing, colors to match new system
- Ensure all interactive elements have proper touch targets (min 44px)
- All text readable without zooming on mobile

---

### 4. Enhanced PWA Configuration

#### [MODIFY] [manifest.json](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/public/manifest.json)
- Add multiple icon sizes (192x192, 512x512) via SVG
- Add `orientation: "portrait"`
- Add `categories: ["utilities", "security"]`
- Add `shortcuts` for quick scan access
- Proper scope and start_url

#### [MODIFY] [sw.js](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/public/sw.js)
- Improved caching strategy (network-first for API, cache-first for assets)
- Offline fallback page support
- Cache versioning

#### [MODIFY] [index.html](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/index.html)
- Apple-specific meta tags for iOS PWA
- Splash screen color
- `mobile-web-app-capable` meta

---

### 5. Backend Hardening & Extended Features

#### [MODIFY] [main.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/main.py)
- Serve built frontend static files from `frontend/dist` in production
- Add `/` catch-all to serve `index.html` for SPA routing
- Add proper error handlers
- Health endpoint with version info

#### [NEW] [Procfile](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/Procfile)
- `web: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### [NEW] [render.yaml](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/render.yaml)
- Render deployment configuration

#### [NEW] [build.sh](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/build.sh)
- Build script: installs frontend deps, builds Vite, installs Python deps
- Used by Render as build command

#### [MODIFY] [requirements.txt](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/requirements.txt)
- Remove `supabase` and `redis` (not needed for MVP, simplifies deploy)
- Add `gunicorn` for production
- Keep `scikit-learn` for ML model

---

### 6. Offline ML & Extended Capabilities (No API Needed)

To make the app feel like more than an API wrapper, I'll add several **client-side and server-side intelligence features** that work without any external API calls.

#### [NEW] [text_analysis.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/engines/text_analysis.py)
- **Entropy Analysis**: Shannon entropy of the QR payload to detect encoded/obfuscated strings
- **Language Detection**: Simple heuristic to detect if payload contains social engineering phrases
- **Pattern Matching**: Detect common scam patterns (lottery, prize claims, urgency markers)
- **Base64/Hex Detection**: Flag base64-encoded or hex-encoded payloads that might hide malicious content

#### [MODIFY] [ml_classifier.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/engines/ml_classifier.py)
- Ensure the HeuristicPhishingModel works robustly without the .pkl file
- Add confidence intervals to predictions
- Add feature importance explanations (which features contributed most)

#### [MODIFY] [feature_extractor.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/models/feature_extractor.py)
- Add more URL features:
  - Special character ratio
  - Vowel-to-consonant ratio (obfuscation signal)
  - URL structure similarity to known phishing patterns
  - Brand name detection in suspicious URLs (paypal, amazon, etc.)

#### [NEW] [content_scanner.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/engines/content_scanner.py)
- Cross-payload intelligence: check if any payload contains references to known phishing/scam patterns
- Regex-based detection of:
  - Credit card number patterns
  - Aadhaar number patterns
  - PAN number patterns
  - Phone numbers being exfiltrated
- Flag data exfiltration attempt payloads

#### Extend all pipelines with more offline checks:
- **SMS pipeline**: Enhanced urgency word detection, premium number detection improvements
- **Email pipeline**: Check for spoofed sender patterns
- **vCard pipeline**: Detect suspicious field combinations
- **Calendar pipeline**: Detect meeting invites with suspicious links

---

### 7. New Feature Pages (Extensiveness)

To make the app feel substantial for hackathon judges:

#### [NEW] [Learn.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/Learn.tsx)
- **Security Education Center**: Tips on QR scam types
- Interactive examples of safe vs. dangerous QR payloads  
- Visual explainers of each payload type
- Clickable demo QR payloads that show what KoiShak would flag

#### [NEW] [QuickCheck.tsx](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/pages/QuickCheck.tsx)
- Manual URL/UPI verifier (paste and check without a QR)
- Batch check mode (paste multiple payloads)
- Results comparison view

These pages will be accessible from the Home page as feature cards rather than cluttering the bottom nav.

---

### 8. Error Fixes & Robustness

#### [MODIFY] [api.ts](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/lib/api.ts)
- Fix the API URL resolution for production (when frontend is served by backend, API is relative `/api/...`)
- Add request retry logic
- Better timeout handling
- Proper error typing

#### [MODIFY] [useVerdict.ts](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/src/hooks/useVerdict.ts)
- Add retry logic
- Better error messages for mobile users
- Handle network offline state

#### [MODIFY] all backend pipelines
- Add try/catch around every external API call
- Graceful degradation: If APIs fail, still return ML + heuristic signals
- Fix potential crashes from malformed payloads

#### [MODIFY] [cache.py](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/backend/app/utils/cache.py)
- Replace deprecated `datetime.utcnow()` with `datetime.now(timezone.utc)`

---

### 9. Deployment Configuration

#### [MODIFY] [vite.config.ts](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/frontend/vite.config.ts)
- Set build output to `../backend/static` for monorepo deployment OR keep `dist/` and copy in build script
- Add PWA plugin if needed

#### [MODIFY] [.gitignore](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/.gitignore)
- Ensure proper ignore patterns for deploy artifacts
- Keep `phishing_model.pkl` tracked (needed for deployment)

#### [NEW] [README.md](file:///c:/Users/Prateek/Documents/Antigravity/Koi_ShaK/README.md) (overwrite)
- Complete rewrite with KoiShak branding
- Features overview, tech stack, architecture diagram
- Setup instructions for local development
- Deployment guide for Render
- Demo QR codes section
- Screenshots section (placeholder paths)

---

## Open Questions

> [!IMPORTANT]
> 1. **Tagline**: I'm going with *"कोई शक? — Know Before You Open"* as the tagline. The Hindi text adds an authentic India-first feel. Acceptable?

> [!IMPORTANT]  
> 2. **Color Palette**: Shifting from pure violet (`#7C3AED`) to a **teal-violet gradient** (`#06B6D4` → `#7C3AED`) for the primary accent. This creates a more unique, less "generic dark theme" look. Acceptable?

> [!IMPORTANT]
> 3. **Bottom navigation has 4 items**: Home, Scan, History, Dashboard. The Learn and QuickCheck pages are accessible from feature cards on the Home page. Good with this navigation structure?

---

## Verification Plan

### Automated Tests
1. `cd frontend && npm run build` — verify zero TypeScript/build errors
2. `cd backend && python -m py_compile app/main.py` — verify Python syntax
3. Test backend: `curl http://localhost:8000/api/scan -d '{"payload":"https://google.com"}'`
4. Test demo payloads from the test matrix
5. Browser test: Open on mobile viewport, verify camera starts/stops correctly

### Manual Verification
1. Open app on mobile Chrome (or emulated mobile viewport)
2. Verify PWA install prompt appears
3. Scan a QR code → verify camera stops after scan
4. Verify all pages render correctly with new branding
5. Test offline behavior (cached assets load)
6. Deploy to Render and verify the monorepo serves correctly
