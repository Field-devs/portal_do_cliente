/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'lg': 'none',
        'DEFAULT': 'none',
        'md': 'none',
        'sm': 'none',
        'xl': 'none',
        '2xl': 'none',
        'inner': 'none',
        'dark-lg': 'none',
        'dark': 'none',
        'dark-md': 'none',
        'dark-sm': 'none',
        'dark-xl': 'none',
        'dark-2xl': 'none',
        'dark-inner': 'none'
      },
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
          card: 'rgba(17, 24, 39, 0.85)',
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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        dotBounce1: {
          '0%, 80%, 100%': { 
            transform: 'translateY(0)',
            opacity: '0.6'
          },
          '40%': { 
            transform: 'translateY(-8px)',
            opacity: '1'
          }
        },
        dotBounce2: {
          '0%, 20%, 100%': { 
            transform: 'translateY(0)',
            opacity: '0.6'
          },
          '60%': { 
            transform: 'translateY(-8px)',
            opacity: '1'
          }
        },
        dotBounce3: {
          '0%, 40%, 100%': { 
            transform: 'translateY(0)',
            opacity: '0.6'
          },
          '80%': { 
            transform: 'translateY(-8px)',
            opacity: '1'
          }
        },
        modalSlideIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(-10px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)' 
          }
        },
        logoFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95) rotate(-10deg)'
          },
          '100%': {
            opacity: '1', 
            transform: 'scale(1) rotate(0)'
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        dotBounce1: 'dotBounce1 1.4s infinite ease-in-out',
        dotBounce2: 'dotBounce2 1.4s infinite ease-in-out',
        dotBounce3: 'dotBounce3 1.4s infinite ease-in-out',
        modalSlideIn: 'modalSlideIn 0.3s ease-out',
        logoFadeIn: 'logoFadeIn 0.5s ease-out'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({
      nocompatible: true,
      themePreferences: {
        scrollbarWidth: '4px',
        scrollbarRadius: '0.5rem'
      }
    })
  ]
};