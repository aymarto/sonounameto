import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        butler: ["Butler", "Georgia", "serif"],
        display: ["Butler", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0a",
        paper: "#f7f5f1",
      },
      letterSpacing: {
        "wide-xl": "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
