/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#08060a",
        panel: "#0f0c13",
        line: "#241c2b",
        violet: "#8b2ff5",
        crimson: "#ff2e5a",
        bone: "#f2eef7"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(100deg, #8b2ff5 0%, #d4249e 45%, #ff2e5a 100%)"
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(139,47,245,0.45)"
      }
    }
  },
  plugins: []
};
