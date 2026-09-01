import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens — REKA UMKM
        primary: "#FE7F2D",
        "primary-dark": "#E06820",
        "primary-light": "#FEA35F",
        "primary-xlight": "#FFF1E8",
        "neutral-bg": "#F8F7F5",
        success: "#3F9142",
        "success-light": "#E8F5E9",
        danger: "#D64545",
        "danger-light": "#FDEAEA",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
