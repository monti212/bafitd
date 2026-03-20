/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0096B3',
          50:  '#e0f6fb',
          100: '#b3e9f5',
          200: '#80daee',
          300: '#4dcbe7',
          400: '#26bfdf',
          500: '#0096B3',
          600: '#007a91',
          700: '#005c6d',
          800: '#003d49',
          900: '#001e26',
        },
        'accent-orange': {
          DEFAULT: '#FF6A00',
          light:   '#FF8C3F',
          dark:    '#CC5500',
        },
        'deep-navy': '#002F4B',
        sand: {
          50:  '#FDFDFC',
          100: '#F9F9F8',
          200: '#F7F5F2',
          300: '#EDE8E0',
        },
      },
      fontFamily: {
        headline: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
