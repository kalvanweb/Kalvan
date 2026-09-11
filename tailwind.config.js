/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1C1B19",
        ink: "#111110",
        ivory: "#F3EEE5",
        "ivory-dark": "#E9E1D2",
        stone: "#A79E8F",
        "stone-light": "#C9C1B2",
        olive: "#6B6B4D",
        "olive-dark": "#4E4E38",
        rust: "#B5673A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      maxWidth: {
        "8xl": "1440px",
      },
    },
  },
  plugins: [],
};
