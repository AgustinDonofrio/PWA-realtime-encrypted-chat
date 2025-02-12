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
        "disabled-gray": "#9EABB8",
        "error-red": "#E74C3C",
        "main-gray": "#C6C6C6",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
