import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

/**
 * Tailwind configuration for JastipBwi.
 * - Primary: deep olive green (#2F4F2F)
 * - Accent : golden amber (#FFBF00)
 * - Background tint: soft terracotta (#E8D4C7)
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F4F2F', // deep olive green
        accent: '#FFBF00', // golden amber
        bgTint: '#E8D4C7', // soft terracotta
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
