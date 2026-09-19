import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7c3cff',
          blue: '#3b82f6',
          bg: '#0a0a12',
          surface: '#141321',
          surfaceStrong: '#1b1a30',
          text: '#f5f4fb',
          muted: '#b6b2c8',
          mutedStrong: '#8f8aa5',
        },
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        display: ['Sora', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        glow: '0 24px 60px rgba(124, 60, 255, 0.22)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7c3cff, #3b82f6)',
        'hero-glow': 'radial-gradient(circle at 10% 20%, rgba(124, 60, 255, 0.16), transparent 45%)',
      },
    },
  },
  plugins: [],
};
