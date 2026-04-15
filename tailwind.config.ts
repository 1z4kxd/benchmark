// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Mapped to CSS variables set in layout.tsx
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },

      // Game phase colors — also defined as CSS vars in globals.css
      colors: {
        'phase-idle':     '#0a0a0a',
        'phase-waiting':  '#7f1d1d',  // red-900
        'phase-active':   '#14532d',  // green-900
        'phase-early':    '#1e3a5f',
      },

      // Responsive height utility for game screens
      height: {
        content: 'calc(100vh - 3.5rem)', // Full viewport minus navbar
      },
      minHeight: {
        content: 'calc(100vh - 3.5rem)',
      },

      // Animation
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 200ms ease-out',
        'scale-in': 'scale-in 150ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
