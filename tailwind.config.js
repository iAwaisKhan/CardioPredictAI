/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#32b8c6',
          DEFAULT: '#21808d',
          dark: '#1d7480',
        },
        surface: '#fffffb',
        background: '#fcfcf9',
      },
    },
  },
  plugins: [],
}
