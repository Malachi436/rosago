/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        cream: '#FDFDFD',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      }
    }
  },
  plugins: []
};
