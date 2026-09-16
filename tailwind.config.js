/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#3B82F6',
        accent: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}
