/** @type {import('tailwindcss').Config} */
module.exports = {
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
      spacing: {
        4: "1rem", // 16px
        6: "1.5rem", // 24px
        8: "2rem", // 32px
      },
    },
  },
  plugins: [],
};
