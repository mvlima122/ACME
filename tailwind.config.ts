import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './scr/app/**/*.{js,ts,jsx,tsx}',
    './scr/components/**/*.{js,ts,jsx,tsx}'
    ],
  theme: {
    extend: {}
  },
  plugins: []

};

export default config;