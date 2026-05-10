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
        "inverse-surface": "#32302d",
        "inverse-on-surface": "#f5f0eb",
        outline: "#6f7979",
        "outline-variant": "#bec9c8",
        "surface-tint": "#0d6969",
        // Primary
        primary: "#006262",
        "on-primary": "#ffffff",
        "primary-container": "#2a7b7b",
        "on-primary-container": "#c7fffe",
        "inverse-primary": "#87d3d3",
        "primary-fixed": "#a3f0ef",
        "primary-fixed-dim": "#87d3d3",
        "on-primary-fixed": "#002020",
        "on-primary-fixed-variant": "#004f50",
        // Secondary
        secondary: "#136299",
        "on-secondary": "#ffffff",
        "secondary-container": "#82c1fd",
        "on-secondary-container": "#004e7e",
        "secondary-fixed": "#cfe5ff",
        "secondary-fixed-dim": "#98cbff",
        "on-secondary-fixed": "#001d33",
        "on-secondary-fixed-variant": "#004a77",
        // Tertiary
        tertiary: "#943b23",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#b45238",
        "on-tertiary-container": "#fff1ee",
        "tertiary-fixed": "#ffdbd2",
        "tertiary-fixed-dim": "#ffb4a1",
        "on-tertiary-fixed": "#3c0800",
        "on-tertiary-fixed-variant": "#7e2b14",
        // Error
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        // Background
        background: "#fef8f4",
        "on-background": "#1d1b19",
        "surface-variant": "#e7e1dd",
      },
      fontFamily: {
        beVietnamPro: ["var(--font-be-vietnam-pro)", "sans-serif"],
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
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
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
