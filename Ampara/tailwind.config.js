/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#FCD34D", dark: "#FCD34D" },
        accent: { DEFAULT: "#FBBF24", dark: "#F59E0B" },
        background: { DEFAULT: "#FFFDF7", dark: "#18181B" },
        text: { DEFAULT: "#3F3F46", dark: "#E4E4E7" },
        subtitle: { DEFAULT: "#6B7280", dark: "#9CA3AF" },
        border: { DEFAULT: "#D4D4D8", dark: "#27272A" },
        badge: { DEFAULT: "#FEF9C3", dark: "#3F3F46" },
        highlight: { DEFAULT: "#F59E0B", dark: "#D97706" },
        calm: { DEFAULT: "#A78BFA", dark: "#7C3AED" },
      },
      spacing: {
        4: "1rem", // 16px
        6: "1.5rem", // 24px
        8: "2rem", // 32px
      },
    },
  },
  plugins: [],
};
