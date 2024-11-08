/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}',],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',        // Soft indigo for accents
        secondary: '#6366F1',      // Light purple for highlights
        accent: '#F3F4F6',         // Light gray for backgrounds
        dark: '#111827',           // Dark gray for text
        light: '#E5E7EB',          // Light gray for borders and subtle details
      },
    },
  },
  plugins: [],
}

