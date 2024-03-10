/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'brand-yellow-prominent': '#FDD453',
        'brand-yellow-lighter': '#FEEDA1',
        'brand-yellow-light': '#FDEA76',
        'brand-yellow-dark': '#FCC333',
        'brand-yellow-darker': '#DBA30D',
      },
      },
  },
  plugins: [],
}

