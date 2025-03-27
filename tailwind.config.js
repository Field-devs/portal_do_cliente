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
          primary: '#0A0F1D',
          secondary: '#151E2C',
          accent: '#2563EB',
          card: 'rgba(17, 24, 39, 0.95)',
          border: 'rgba(75, 85, 99, 0.6)',
          text: {
            primary: '#FFFFFF',
            secondary: '#E2E8F0',
            accent: '#3B82F6'
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
              bg: 'rgba(22, 163, 74, 0.25)',
              text: '#34D399',
              border: 'rgba(22, 163, 74, 0.4)'
            }
          },
          warning: {
            light: {
              bg: '#FEFCE8',
              text: '#854D0E',
              border: '#FEF08A'
            },
            dark: {
              bg: 'rgba(234, 179, 8, 0.25)',
              text: '#FBBF24',
              border: 'rgba(234, 179, 8, 0.4)'
            }
          },
          error: {
            light: {
              bg: '#FEF2F2',
              text: '#991B1B',
              border: '#FECACA'
            },
            dark: {
              bg: 'rgba(220, 38, 38, 0.25)',
              text: '#EF4444',
              border: 'rgba(220, 38, 38, 0.4)'
            }
          },
          info: {
            light: {
              bg: '#F0F9FF',
              text: '#075985',
              border: '#BAE6FD'
            },
            dark: {
              bg: 'rgba(14, 165, 233, 0.25)',
              text: '#0EA5E9',
              border: 'rgba(14, 165, 233, 0.4)'
            }
          }
        }
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        'full': '9999px'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true })
  ]
};