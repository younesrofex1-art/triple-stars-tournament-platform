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
        background: '#08090B',
        surface: {
          50: '#222731',
          100: '#1A1E26',
          200: '#12151B',
          300: '#0D0F13',
        },
        border: {
          subtle: '#1C2028',
          DEFAULT: '#262B35',
          active: '#EA580C',
        },
        brand: {
          orange: '#FF6B00',
          dark: '#EA580C',
          muted: '#9A3412',
          subtle: 'rgba(234, 88, 12, 0.12)',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          zinc: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.65)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
        'orange-sm': '0 2px 10px rgba(234, 88, 12, 0.25)',
      },
    },
  },
  plugins: [],
}
