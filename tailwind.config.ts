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
        // DESIGN.md Core Tokens
        "cream-paper": "#fafaf8",
        "card-white": "#ffffff",
        "pebble-gray": "#f0f0ef",
        "linen-border": "#e4e5e1",
        ash: "#d9d9d9",
        ink: "#141415",
        graphite: "#2e2e2c",
        carbon: "#454542",
        slate: "#6e6f6c",
        stone: "#8c8c89",
        fog: "#b7b7b4",
        "signal-orange": "#f35b22",
        ember: "#ff5e24",
        apricot: "#f77c55",
        "burnt-orange": "#be400f",
        persimmon: "#d14200",
        "peach-blush": "#ffcab5",
        "teal-token": "#88d2c3",
        "sky-token": "#8bc5f3",
        "orchid-token": "#c678dd",
        forest: "#165424",
        "success-green": "#62b06d",
        "coral-alert": "#f67976",
        "rose-blush": "#f9aea9",

        // Mapped Brand Tokens for REKA
        primary: "#f35b22",
        "primary-dark": "#d14200",
        "primary-light": "#f77c55",
        "primary-xlight": "#ffcab5",
        "neutral-bg": "#fafaf8",
        success: "#62b06d",
        "success-light": "#eef8f0",
        danger: "#f67976",
        "danger-light": "#fdeaea",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: [
          "'JetBrains Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        subtle: "rgba(24, 25, 22, 0.06) 0px 1px 2px 0px",
        "subtle-card":
          "rgba(228, 229, 225, 0.3) 0px 1px 0px 0px inset, rgba(110, 111, 109, 0.1) 0px -1px 0px 0px inset",
        "btn-primary":
          "rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(24, 25, 22, 0.06) 0px 1px 2px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset",
        "nav-bar":
          "rgba(24, 25, 22, 0.02) 0px 2px 1px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset",
      },
    },
  },
  plugins: [],
};
export default config;
