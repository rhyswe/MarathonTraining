/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F7F5F1",
        surface: "#FFFFFF",
        "surface-muted": "#EFEBE3",
        ink: "#1C1C1A",
        "ink-soft": "#6B6862",
        bib: "#E8552E",
        "bib-soft": "#F6CDBD",
        trail: "#3D5C42",
        "trail-soft": "#CFDCD2",
        line: "#DAD5CB",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
