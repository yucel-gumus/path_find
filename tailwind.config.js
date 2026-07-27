/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 60% — dominant cream
        cream: {
          DEFAULT: '#FFEBD3',
          50: '#FFF9F2',
          100: '#FFEBD3',
          200: '#F5D9B8',
          300: '#E8C9A4',
        },
        // 30% — secondary coral
        coral: {
          DEFAULT: '#FFB6A6',
          50: '#FFE8E2',
          100: '#FFB6A6',
          200: '#F59A88',
          300: '#E07A66',
          800: '#8B4A3C',
          900: '#5C3228',
        },
        // 10% — accent mint
        mint: {
          DEFAULT: '#9BCEC1',
          50: '#E8F5F1',
          100: '#9BCEC1',
          200: '#7AB8A9',
          300: '#5A9E8E',
          800: '#3D6B5F',
        },
        ink: {
          DEFAULT: '#3D342C',
          muted: '#7A6B5D',
          soft: '#A89888',
        },
      },
      fontFamily: {
        sans: [
          'Outfit',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(61, 52, 44, 0.08)',
        card: '0 8px 32px rgba(61, 52, 44, 0.1)',
        lift: '0 12px 40px rgba(61, 52, 44, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        path: 'path-animation 0.45s ease-out forwards',
        visited: 'visited-animation 0.28s ease-out forwards',
      },
      keyframes: {
        'path-animation': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'visited-animation': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
