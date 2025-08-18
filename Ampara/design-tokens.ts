export const designTokens = {
  light: {
    primary: "#FCD34D",
    accent: "#FBBF24",
    background: "#FFFDF7",
    text: "#3F3F46",
    subtitle: "#6B7280",
    border: "#D4D4D8",
    badge: "#FEF9C3",
    highlight: "#F59E0B",
    calm: "#A78BFA",
  },
  dark: {
    primary: "#FCD34D",
    accent: "#F59E0B",
    background: "#18181B",
    text: "#E4E4E7",
    subtitle: "#9CA3AF",
    border: "#27272A",
    badge: "#3F3F46",
    highlight: "#D97706",
    calm: "#7C3AED",
  },
} as const;

export type ColorScheme = keyof typeof designTokens;
