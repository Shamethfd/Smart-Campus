/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#094886',
        secondary: '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 45px rgba(9, 72, 134, 0.12)',
      },
    },
  },
  plugins: [],
};
