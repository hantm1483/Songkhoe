// Design tokens exported from Tailwind config for use in components and JavaScript

// Colors
export const colors = {
  // Surface
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
  // Secondary
  secondary: "#136299",
  "on-secondary": "#ffffff",
  "secondary-container": "#82c1fd",
  "on-secondary-container": "#004e7e",
  // Tertiary
  tertiary: "#943b23",
  "on-tertiary": "#ffffff",
  "tertiary-container": "#b45238",
  "on-tertiary-container": "#fff1ee",
  // Error
  error: "#ba1a1a",
  "on-error": "#ffffff",
  "error-container": "#ffdad6",
  "on-error-container": "#93000a",
  // Background
  background: "#fef8f4",
  "on-background": "#1d1b19",
  // Status colors for glucose
  success: "#006262",
  warning: "#f59e0b",
  warningLow: "#f59e0b",
  warningHigh: "#ef4444",
  normal: "#006262",
  high: "#ef4444",
  low: "#f59e0b",
} as const;

// Typography scale (fontSize in px)
export const typography = {
  "display-lg": { fontSize: 40, lineHeight: 48, fontWeight: 700 },
  "headline-md": { fontSize: 24, lineHeight: 32, fontWeight: 600 },
  "body-lg": { fontSize: 18, lineHeight: 28, fontWeight: 400 },
  "body-md": { fontSize: 16, lineHeight: 24, fontWeight: 400 },
  "label-lg": { fontSize: 14, lineHeight: 20, fontWeight: 600, letterSpacing: 0.5 },
} as const;

// Spacing scale (in px)
export const spacing = {
  8: 8,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
  56: 56,
  "container-padding": 24,
  "stack-gap": 16,
  "touch-target-min": 48,
  "touch-target-preferred": 56,
} as const;

// Border radius (in px)
export const borderRadius = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Base font size for elderly users
export const baseFontSize = typography["body-lg"].fontSize;

// Touch target minimum
export const touchTargetMin = spacing["touch-target-min"];
export const touchTargetPreferred = spacing["touch-target-preferred"];

// Glucose thresholds (mmol/L)
export const glucoseThresholds = {
  normal: { min: 4.0, max: 7.0 },
  low: 4.0,
  high: 7.0,
} as const;