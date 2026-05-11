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
        // GlucoCare Design System
        primary: "#008B8B",
        secondary: "#00A8A8",
        accent: "#FF7F50",
        "bg-warm": "#FDFCFB",
        // Surface colors
        surface: "#fef8f4",
        "surface-dim": "#ded9d5",
        "surface-bright": "#fef8f4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8f3ee",
        "surface-container": "#f2ede9",
        "surface-container-high": "#ede7e3",
        "surface-container-highest": "#e7e1dd",
        "on-surface": "#1d1b19",
        "on-surface-variant": "#3f4948",
        outline: "#6f7979",
        "outline-variant": "#bec9c8",
        // Error
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        // Background
        background: "#fef8f4",
        "on-background": "#1d1b19",
      },
      fontFamily: {
        body: ["var(--font-bevietnam)", "sans-serif"],
        headline: ["var(--font-bevietnam)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "20px", fontWeight: "600", letterSpacing: "0.5px" }],
      },
      spacing: {
        "8": "8px",
        "16": "16px",
        "24": "24px",
        "32": "32px",
        "48": "48px",
        "56": "56px",
        "container-padding": "24px",
        "stack-gap": "16px",
        "touch-target-min": "48px",
        "section-margin": "32px",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.25rem",
        md: "0.75rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      boxShadow: {
        "soft-teal": "0 2px 8px rgba(0, 98, 98, 0.12)",
        "soft-blue": "0 2px 8px rgba(19, 98, 153, 0.12)",
        "soft-terracotta": "0 2px 8px rgba(148, 59, 35, 0.12)",
        "soft-elevation": "0 4px 12px rgba(29, 27, 25, 0.08)",
      },
      minHeight: {
        "touch-target": "48px",
        "touch-target-preferred": "56px",
      },
      minWidth: {
        "touch-target": "48px",
      },
    },
  },
  plugins: [],
};

export default config;