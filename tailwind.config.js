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
          light: '#ff4a4a',
          DEFAULT: '#e63232',
          dark: '#b91c1c',
        },
        surface: '#111113',
        background: '#0a0a0b',
        card: '#18181c',
        muted: '#6b6866',
        'muted-dark': '#3a3836',
        divider: 'rgba(255, 255, 255, 0.07)',
        text: '#f0ede8'
      },
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        serif: ['Instrument Serif', 'serif'],
      }
    },
  },
  plugins: [],
}
