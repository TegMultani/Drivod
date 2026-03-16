import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(215 16% 18%)',
        input: 'hsl(215 18% 14%)',
        ring: 'hsl(215 30% 72%)',
        background: 'hsl(220 22% 6%)',
        foreground: 'hsl(210 16% 94%)',
        muted: {
          DEFAULT: 'hsl(216 17% 12%)',
          foreground: 'hsl(215 14% 65%)'
        },
        card: {
          DEFAULT: 'hsl(220 20% 8%)',
          foreground: 'hsl(210 16% 94%)'
        },
        accent: {
          DEFAULT: 'hsl(217 48% 56%)',
          foreground: 'hsl(210 40% 98%)'
        }
      },
      borderRadius: { xl: '1rem' },
      boxShadow: {
        panel: '0 2px 30px rgba(0,0,0,0.32)',
        soft: 'inset 0 1px 0 rgba(255,255,255,0.04)'
      }
    }
  },
  plugins: []
};

export default config;
