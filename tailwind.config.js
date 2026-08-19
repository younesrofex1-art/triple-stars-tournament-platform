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
        background: '#060709',
        surface: {
          50: '#1F2430',
          100: '#151922',
          200: '#0E1118',
          300: '#080A0E',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.06)',
          DEFAULT: 'rgba(255, 255, 255, 0.10)',
          active: '#F97316',
        },
        brand: {
          orange: '#F97316',
          dark: '#EA580C',
          muted: '#C2410C',
          subtle: 'rgba(249, 115, 22, 0.08)',
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
        'tesla': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'tesla-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'pill': '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
