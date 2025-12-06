/**
 * ROSAgo Color Palette
 * Exact color specifications for the premium school-transport app
 */

export const colors = {
  // Primary Colors
  primary: {
    blue: "#2A7FF4",
    teal: "#1BA7A1",
  },

  // Accent Colors
  accent: {
    sunsetOrange: "#FF8A3D",
    successGreen: "#23C552",
    plantainGreen: "#4BB543",
  },

  // Status Colors
  status: {
    infoBlue: "#4DAAFF",
    warningYellow: "#FFCC00",
    dangerRed: "#E53935",
  },

  // Neutral Colors
  neutral: {
    creamWhite: "#FAF7F2",
    pureWhite: "#FFFFFF",
    textPrimary: "#1D1D1F",
    textSecondary: "#6E6E6E",
    darkGray: "#374151",
    lightGray: "#9CA3AF",
    gray: "#6B7280",
  },

  // Background Colors
  background: {
    dark: "#0F172A",
    light: "#FFFFFF",
    cream: "#FAF7F2",
    surface: "#F3F4F6",
  },

  // Liquid Glass overlay
  glass: {
    overlay: "rgba(255, 255, 255, 0.25)",
    overlayLight: "rgba(255, 255, 255, 0.20)",
    overlayMedium: "rgba(255, 255, 255, 0.30)",
    overlayHeavy: "rgba(255, 255, 255, 0.35)",
  },

  // Dark mode support (for react-navigation)
  dark: false,
  colors: {
    primary: "#2A7FF4",
    background: "#FAF7F2",
    card: "#FFFFFF",
    text: "#1D1D1F",
    border: "#E5E5E5",
    notification: "#FF8A3D",
  },
} as const;

export type Colors = typeof colors;
