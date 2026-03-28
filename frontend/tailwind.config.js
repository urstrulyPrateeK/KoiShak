import typography from "@tailwindcss/typography";
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#0B1120",
                surface: "#111827",
                elevated: "#1E293B",
                violet: "#7C3AED",
                teal: "#06B6D4",
                accent: "#14B8A6",
                success: "#10B981",
                warning: "#FBBF24",
                danger: "#FB7185",
                muted: "#64748B",
            },
            boxShadow: {
                glow: "0 0 24px rgba(6,182,212,0.18), 0 0 48px rgba(124,58,237,0.10)",
                danger: "0 0 24px rgba(251,113,133,0.20)",
                success: "0 0 24px rgba(16,185,129,0.20)",
                soft: "0 2px 24px rgba(0,0,0,0.3)",
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                "mesh-gradient": "radial-gradient(ellipse at 20% 0%, rgba(6,182,212,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(124,58,237,0.06) 0%, transparent 50%)",
            },
            keyframes: {
                scan: {
                    "0%": { transform: "translateY(0)", opacity: "0.6" },
                    "50%": { opacity: "1" },
                    "100%": { transform: "translateY(300px)", opacity: "0.2" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                pulseBorder: {
                    "0%, 100%": { boxShadow: "0 0 0 rgba(251,113,133,0)" },
                    "50%": { boxShadow: "0 0 24px rgba(251,113,133,0.25)" },
                },
                breathe: {
                    "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.02)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                scan: "scan 2.4s linear infinite",
                float: "float 4s ease-in-out infinite",
                pulseBorder: "pulseBorder 2.5s ease-in-out infinite",
                breathe: "breathe 3s ease-in-out infinite",
                shimmer: "shimmer 2s linear infinite",
                slideUp: "slideUp 0.4s ease-out",
            },
        },
    },
    plugins: [typography],
};
