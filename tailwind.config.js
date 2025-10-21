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
        // Brand: slightly brighter navy for better contrast
        brand: {
          primary: '#234EA0',
          primaryHover: '#1F4190',
        },
        // Unified status families (used for gradients)
        info:    { 500: '#3B82F6', 600: '#2563EB' },  // neutral/performance
        success: { 500: '#22C55E', 600: '#16A34A' },  // good/complete
        warn:    { 500: '#F59E0B', 600: '#D97706' },  // warning/action
        danger:  { 500: '#EF4444', 600: '#DC2626' },  // critical
        neutral: { 500: '#64748B', 600: '#475569' },  // slate neutrals
      },
    },
  },
  plugins: [],
};
