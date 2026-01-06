/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#fcfcfc',
        ink: '#2d2d2d',
      },
      fontFamily: {
        mono: ['"Courier Prime"', '"Courier New"', 'Courier', 'monospace'],
        // We rely on Google Fonts loaded in index.html for handwriting
      }
    },
  },
  plugins: [],
};