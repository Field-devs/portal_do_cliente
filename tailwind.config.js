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
          50: '#F8FAFC', 
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#1E3A8A',
          600: '#1E40AF',
          700: '#1E3A8A',
          800: '#1E3A8A',
          900: '#172554'
        },
        light: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          accent: '#1E3A8A',
          card: '#FFFFFF',
          border: '#F1F5F9',
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
              bg: '#ECFDF5',
              text: '#047857',
              border: '#A7F3D0'
            },
            dark: {
              bg: 'rgba(22, 163, 74, 0.25)',
              text: '#34D399',
              border: 'rgba(22, 163, 74, 0.4)'
            }
          },
          warning: {
            light: {
              bg: '#FFFBEB',
              text: '#B45309',
              border: '#FDE68A'
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
              text: '#B91C1C',
              border: '#FCA5A5'
            },
            dark: {
              bg: 'rgba(220, 38, 38, 0.25)',
              text: '#EF4444',
              border: 'rgba(220, 38, 38, 0.4)'
            }
          },
          info: {
            light: {
              bg: '#EFF6FF',
              text: '#1D4ED8',
              border: '#93C5FD'
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