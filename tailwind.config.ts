import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#09090B",
        surface: {
          DEFAULT: "#111114",
          2: "#17171B",
        },
        border: "#26262C",
        text: {
          DEFAULT: "#E5E6E6",
        },
        muted: "#A1A1AA",
        teal: {
          DEFAULT: "#17ABA9",
          400: "#22d3ee",
          500: "#17ABA9",
          600: "#0E8583",
        },
        coral: {
          DEFAULT: "#EA694B",
          500: "#EA694B",
          600: "#C94B2C",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(180deg, #17ABA9 0%, #EA694B 100%)",
        "brand-gradient-h": "linear-gradient(90deg, #17ABA9 0%, #EA694B 100%)",
      },
      boxShadow: {
        "glow-teal": "0 0 40px rgba(23,171,169,0.18)",
        "glow-coral": "0 0 40px rgba(234,105,75,0.18)",
        "glow-combo": "0 0 50px rgba(23,171,169,0.12), 0 0 50px rgba(234,105,75,0.12)",
      },
      fontFamily: {
        heading: ["Lexend", "Outfit", "system-ui", "-apple-system", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.02em",
        widestlabel: "0.08em",
      },
    },
  },
  plugins: [],
};
export default config;
