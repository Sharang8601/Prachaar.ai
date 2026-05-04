/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wa: '#25D366', // Official WhatsApp Green
        wablue: '#34B7F1',
      }
    },
  },
  plugins: [],
}