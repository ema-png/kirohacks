/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,css}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(2, 132, 199, 0.18)',
        lift: '0 8px 30px -12px rgba(193, 78, 63, 0.18)',
      },
      backgroundImage: {
        /** Full-page wash — gradients only for backgrounds */
        'palette-base':
          'linear-gradient(165deg, #ffffff 0%, #FFECE3 38%, #dff5f5 72%, #e8fbfc 100%)',
        'palette-mesh':
          'radial-gradient(ellipse 85% 55% at 0% -10%, rgba(255, 200, 180, 0.45) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(232, 107, 42, 0.14) 0%, transparent 55%), radial-gradient(ellipse 65% 45% at 50% 110%, rgba(3, 105, 161, 0.16) 0%, transparent 55%), linear-gradient(180deg, #ffffff 0%, #FFF8F4 35%, #f0f9ff 100%)',
        'hero-wash':
          'linear-gradient(145deg, #ffffff 0%, rgba(255, 216, 200, 0.55) 42%, rgba(232, 243, 244, 0.9) 100%)',
        'footer-deep':
          'linear-gradient(135deg, #0c4a6e 0%, #0369a1 45%, #075985 100%)',
        'howit-wash':
          'linear-gradient(160deg, #ffffff 0%, rgba(255, 236, 227, 0.85) 50%, rgba(223, 245, 245, 0.75) 100%)',
      },
      colors: {
        /** Readable grays on warm / cool tinted backgrounds */
        gray: {
          300: '#c4c9d1',
          400: '#8b929d',
          500: '#5e6670',
          600: '#4a5159',
        },
        slate: {
          400: '#7b8797',
          500: '#546274',
          600: '#3e4b5c',
        },
        /**
         * Named palette:
         * Dark cyan · White · Peach fuzz · Tiger orange · Rosy copper
         */
        plate: {
          'dark-cyan': '#0369a1',
          'peach-fuzz': '#FFC8B4',
          'tiger-orange': '#E86B2A',
          'rosy-copper': '#C14E3F',
          white: '#ffffff',
          /** Short aliases used across the codebase */
          peach: '#FFC8B4',
          teal: '#0369a1',
          orange: '#E86B2A',
          clay: '#C14E3F',
        },
        /** Warm UI — tiger orange → rosy copper */
        brand: {
          50: '#fff9f6',
          100: '#FFEBE2',
          200: '#ffd4c4',
          300: '#ffb899',
          400: '#f08f54',
          500: '#E86B2A',
          600: '#C14E3F',
          700: '#9e3e34',
          800: '#7c322a',
          900: '#5c261f',
        },
        /** Cool UI — cyan blue (sky family), no teal / purple cast */
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
