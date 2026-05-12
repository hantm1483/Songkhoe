import type { Config } from "tailwindcss";

/**
 * Sống Khỏe Design System
 * Natural Tones theme from sống-khỏe---quản-lý-tiểu-đường
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sống Khỏe - Natural Tones Theme
        natural: {
          bg: "#F9F7F2",
          text: "#4A4F41",
          primary: "#8BA888",
          "primary-dark": "#5C6E5A",
          border: "#E6E2D3",
          accent: "#BC4749",
          soft: "#E9EDC9",
          "soft-dark": "#CCD5AE",
          beige: "#F2E8CF",
          light: "#F0F4EF",
        },
        // Legacy Empathetic Tribute colors (keeping for backward compat)
        primary: {
          DEFAULT: "#006262",
          container: "#2a7b7b",
          fixed: "#a3f0ef",
          "fixed-dim": "#87d3d3",
          tint: "#0d6969",
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#c7fffe",
        "inverse-primary": "#87d3d3",
        "on-primary-fixed": "#002020",
        "on-primary-fixed-variant": "#004f50",

        secondary: {
          DEFAULT: "#136299",
          container: "#82c1fd",
          fixed: "#cfe5ff",
          "fixed-dim": "#98cbff",
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#004e7e",
        "on-secondary-fixed": "#001d33",
        "on-secondary-fixed-variant": "#004a77",

        tertiary: {
          DEFAULT: "#943b23",
          container: "#b45238",
          fixed: "#ffdbd2",
          "fixed-dim": "#ffb4a1",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fff1ee",
        "on-tertiary-fixed": "#3c0800",
        "on-tertiary-fixed-variant": "#7e2b14",

        surface: {
          DEFAULT: "#fef8f4",
          dim: "#ded9d5",
          bright: "#fef8f4",
          "container-lowest": "#ffffff",
          container: {
            low: "#f8f3ee",
            DEFAULT: "#f2ede9",
            high: "#ede7e3",
            highest: "#e7e1dd",
          },
          variant: "#e7e1dd",
          tint: "#0d6969",
        },
        "on-surface": "#1d1b19",
        "on-surface-variant": "#3f4948",
        "inverse-surface": "#32302d",
        "inverse-on-surface": "#f5f0eb",

        outline: "#6f7979",
        "outline-variant": "#bec9c8",

        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        background: "#F9F7F2",
        "on-background": "#1d1b19",

        accent: "#BC4749",

        "bg-warm": "#F9F7F2",
        "surface-tint": "#0d6969",
      },
      fontFamily: {
        body: ["var(--font-bevietnam)", "sans-serif"],
        headline: ["var(--font-bevietnam)", "sans-serif"],
      },
      fontSize: {
        // Display
        "display-lg": ["40px", { lineHeight: "48px", fontWeight: "700" }],
        // Headlines
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        // Body
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        // Labels
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
        "touch-target-preferred": "56px",
        "section-margin": "32px",
        "unit": "8px",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "48px",
        full: "9999px",
      },
      boxShadow: {
        // Sống Khỏe Natural Theme Shadows
        "natural": "0 4px 12px rgba(139, 168, 136, 0.08)",
        "natural-md": "0 8px 24px rgba(139, 168, 136, 0.12)",
        "natural-lg": "0 12px 32px rgba(139, 168, 136, 0.16)",
        // Ambient Tinted Shadows (soft, no harsh black)
        "soft-teal": "0 4px 12px rgba(0, 98, 98, 0.08)",
        "soft-primary": "0 4px 12px rgba(0, 98, 98, 0.12)",
        "soft-secondary": "0 4px 12px rgba(19, 98, 153, 0.12)",
        "soft-terracotta": "0 4px 12px rgba(148, 59, 35, 0.12)",
        "soft-elevation": "0 4px 12px rgba(29, 27, 25, 0.08)",
        // Card shadows
        "card": "0 4px 12px rgba(0, 98, 98, 0.03)",
        "card-hover": "0 8px 24px rgba(0, 98, 98, 0.08)",
        // Glass effect
        "glass": "0 4px 16px rgba(0, 98, 98, 0.06)",
      },
      minHeight: {
        "touch-target": "48px",
        "touch-target-preferred": "56px",
      },
      minWidth: {
        "touch-target": "48px",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;