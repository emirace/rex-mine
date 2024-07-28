/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1e203b",
        primary: "#2563eb",
        secondary: "#2b2e4a",
      },
    },
  },
  plugins: [],
};
