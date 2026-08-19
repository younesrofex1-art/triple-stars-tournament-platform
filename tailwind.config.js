/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: {
          50: '#22222A',
          100: '#17171C',
          200: '#0F0F13',
          300: '#08080A',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.05)',
          DEFAULT: 'rgba(255, 255, 255, 0.09)',
          gold: 'rgba(245, 158, 11, 0.25)',
        },
        brand: {
          orange: '#F59E0B',
          dark: '#D97706',
          deep: '#B45309',
          gold: '#EAB308',
          subtle: 'rgba(245, 158, 11, 0.08)',
        },
        accent: {
          emerald: '#10B981',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          rose: '#F43F5E',
          zinc: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        arabic: ['Readex Pro', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
        'gold-glow': '0 0 35px rgba(217, 119, 6, 0.15)',
        'subtle': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
