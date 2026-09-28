import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        ink: {
          DEFAULT: '#1f1d1a',
          soft: '#4a463f',
          muted: '#77716a',
          faint: '#a9a39a',
        },
        line: '#ebe6dc',
        canvas: '#f7f4ee',
        tile: '#f1ece2',
        leaf: {
          50: '#eef5f0',
          100: '#d4e8db',
          200: '#a6cdb4',
          500: '#1b6b45',
          600: '#155a39',
          700: '#10482e',
          900: '#0a2e1d',
        },
        sun: {
          50: '#fdf6e7',
          100: '#f9e6bd',
          400: '#e9a23b',
          500: '#d18a1f',
        },
        offer: {
          DEFAULT: '#c2410c',
          soft: '#fcece3',
        },
        // legacy alias kept for admin screens
        primary: {
          DEFAULT: '#1b6b45',
          dark: '#10482e',
          light: '#d4e8db',
        },
      },
      boxShadow: {
        '2xs': '0 1px 1px rgba(0,0,0,0.03)',
        xs: '0 1px 2px rgba(0,0,0,0.05)',
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        bar: '0 -6px 24px rgba(16,24,40,0.08)',
        pop: '0 12px 32px -8px rgba(16,24,40,0.24)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'fade-in': 'fade-in 160ms ease-out',
        'sheet-up': 'sheet-up 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        pop: 'pop 420ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
