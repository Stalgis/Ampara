/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        subtitle: "rgb(var(--color-subtitle) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        badge: "rgb(var(--color-badge) / <alpha-value>)",
        highlight: "rgb(var(--color-highlight) / <alpha-value>)",
        calm: "rgb(var(--color-calm) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
