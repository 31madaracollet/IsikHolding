import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFC800",
          50: "#FFFBEB",
          100: "#FFF4C6",
          200: "#FFE88A",
          300: "#FFD84D",
          400: "#FFC800",
          500: "#F5B800",
          600: "#D99A00",
          700: "#B47B00",
          800: "#8F5F00",
          900: "#6B4600",
        },
        ink: {
          DEFAULT: "#121212",
          soft: "#2A2A2A",
          muted: "#6E6C66",
        },
        cream: "#FFFCF4",
        sand: "#F7F2E6",
      },
      fontFamily: {
        sans: ["Manrope Variable", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "Space Grotesk Variable",
          "Manrope Variable",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 60px -24px rgba(18, 18, 18, 0.18)",
        card: "0 2px 4px rgba(18,18,18,0.02), 0 18px 40px -24px rgba(18,18,18,0.22)",
        glow: "0 0 0 1px rgba(245,184,0,0.18), 0 24px 60px -22px rgba(245,184,0,0.55)",
        insetline: "inset 0 0 0 1px rgba(18,18,18,0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-fast": "marquee 26s linear infinite",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 11s ease-in-out infinite",
        "spin-slow": "spin 26s linear infinite",
        pulseGlow: "pulseGlow 4.5s ease-in-out infinite",
        rise: "rise 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "ticker": "ticker 24s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(18,18,18,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,18,18,0.05) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(255,200,0,0.28), transparent 68%)",
      },
    },
  },
  plugins: [],
};

export default config;
