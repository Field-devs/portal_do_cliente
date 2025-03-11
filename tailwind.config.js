/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E3A8A',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#1E3A8A',
          600: '#1E40AF',
          700: '#1E3A8A',
          800: '#1E3A8A',
          900: '#172554'
        },
        light: {
          primary: '#F8FAFC',
          secondary: '#F1F5F9',
          accent: '#1E3A8A',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: {
            primary: '#1E293B',
            secondary: '#475569',
            accent: '#2563EB'
          }
        },
        dark: {
          primary: '#0F172A',
          secondary: '#1E293B',
          accent: '#3B82F6',
          card: 'rgba(30, 41, 59, 0.9)',
          border: 'rgba(51, 65, 85, 0.5)',
          text: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            accent: '#60A5FA'
          }
        },
        status: {
          success: {
            light: {
              bg: '#F0FDF4',
              text: '#166534',
              border: '#BBF7D0'
            },
            dark: {
              bg: 'rgba(22, 163, 74, 0.2)',
              text: '#4ADE80',
              border: 'rgba(22, 163, 74, 0.3)'
            }
          },
          warning: {
            light: {
              bg: '#FEFCE8',
              text: '#854D0E',
              border: '#FEF08A'
            },
            dark: {
              bg: 'rgba(234, 179, 8, 0.2)',
              text: '#FACC15',
              border: 'rgba(234, 179, 8, 0.3)'
            }
          },
          error: {
            light: {
              bg: '#FEF2F2',
              text: '#991B1B',
              border: '#FECACA'
            },
            dark: {
              bg: 'rgba(220, 38, 38, 0.2)',
              text: '#F87171',
              border: 'rgba(220, 38, 38, 0.3)'
            }
          },
          info: {
            light: {
              bg: '#F0F9FF',
              text: '#075985',
              border: '#BAE6FD'
            },
            dark: {
              bg: 'rgba(14, 165, 233, 0.2)',
              text: '#38BDF8',
              border: 'rgba(14, 165, 233, 0.3)'
            }
          }
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
};