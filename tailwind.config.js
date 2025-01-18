/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      backgroundColor: {
        "main-color": "#121417",
      },
      colors: {
        steel: "#293038",
        "light-gray": "#9EABB8",
        "royal-blue": "#1466B8",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
