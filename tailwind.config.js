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
        primary: '#366092',
        secondary: '#B4C7E7',
        warning: '#FCE4D6',
        success: '#C6EFCE',
        input: '#FFF2CC',
      },
    },
  },
  plugins: [],
}
