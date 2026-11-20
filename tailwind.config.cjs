/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ekos-green': '#2F5233',
        'ekos-gray': '#F3F4F6',
      }
    },
  },
  plugins: [],
}