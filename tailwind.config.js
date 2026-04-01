/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'card': '2rem',
        'modal': '2.5rem',
      },
    },
  },
  plugins: [],
}
