import typography from "@tailwindcss/typography";
declare const _default: {
    content: string[];
    theme: {
        extend: {
            colors: {
                ink: string;
                surface: string;
                elevated: string;
                violet: string;
                teal: string;
                accent: string;
                success: string;
                warning: string;
                danger: string;
                muted: string;
            };
            boxShadow: {
                glow: string;
                danger: string;
                success: string;
                soft: string;
            };
            borderRadius: {
                "2xl": string;
                "3xl": string;
            };
            fontFamily: {
                sans: [string, string];
                mono: [string, string];
            };
            backgroundImage: {
                "mesh-gradient": string;
            };
            keyframes: {
                scan: {
                    "0%": {
                        transform: string;
                        opacity: string;
                    };
                    "50%": {
                        opacity: string;
                    };
                    "100%": {
                        transform: string;
                        opacity: string;
                    };
                };
                float: {
                    "0%, 100%": {
                        transform: string;
                    };
                    "50%": {
                        transform: string;
                    };
                };
                pulseBorder: {
                    "0%, 100%": {
                        boxShadow: string;
                    };
                    "50%": {
                        boxShadow: string;
                    };
                };
                breathe: {
                    "0%, 100%": {
                        opacity: string;
                        transform: string;
                    };
                    "50%": {
                        opacity: string;
                        transform: string;
                    };
                };
                shimmer: {
                    "0%": {
                        backgroundPosition: string;
                    };
                    "100%": {
                        backgroundPosition: string;
                    };
                };
                slideUp: {
                    "0%": {
                        opacity: string;
                        transform: string;
                    };
                    "100%": {
                        opacity: string;
                        transform: string;
                    };
                };
            };
            animation: {
                scan: string;
                float: string;
                pulseBorder: string;
                breathe: string;
                shimmer: string;
                slideUp: string;
            };
        };
    };
    plugins: (typeof typography)[];
};
export default _default;
