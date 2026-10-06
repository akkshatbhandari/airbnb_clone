/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        airbnb: {
          red: '#FF385C',
          dark: '#222222',
          gray: '#717171',
          light: '#DDDDDD',
          bg: '#F7F7F7',
          hover: '#E00B41',
        },
      },
      boxShadow: {
        airbnb: '0 6px 16px rgba(0, 0, 0, 0.12)',
        card: '0 3px 12px rgba(0, 0, 0, 0.08)',
        search: '0 3px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
