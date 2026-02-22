/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0a0a0a",
        primary: {
          DEFAULT: "#171717",
          foreground: "#fafafa",
        },
        secondary: {
          DEFAULT: "#f5f5f5",
          foreground: "#171717",
        },
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#737373",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#fafafa",
        },
        border: "#e5e5e5",
        input: "#e5e5e5",
      },
    },
  },
  plugins: [],
};
