/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#07152E',
        light: {
          primary: '#FFFFFF',
          secondary: '#F9FAFB',
          text: {
            primary: '#111827',
            secondary: '#4B5563',
            muted: '#6B7280'
          },
          border: '#E5E7EB',
          input: {
            bg: '#FFFFFF',
            border: '#D1D5DB',
            focus: '#3B82F6'
          }
        },
        dark: {
          primary: '#111827',
          secondary: '#1F2937',
          text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            muted: '#9CA3AF'
          },
          border: '#374151',
          input: {
            bg: '#1F2937',
            border: '#4B5563',
            focus: '#60A5FA'
          }
        }
      }
    },
  },
  plugins: [],
};