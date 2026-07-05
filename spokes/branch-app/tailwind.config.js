/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================
        // DEEP LUXURY NAVY & MINT PALETTE
        // ============================================

        // Primary Text & Structural Headers: #0B192C
        'navy': {
          DEFAULT: '#0B192C',
          50: '#E6EBF0',
          100: '#CCD7E1',
          200: '#99AFC3',
          300: '#6687A5',
          400: '#335F87',
          500: '#1E3E62',
          600: '#0B192C',
          700: '#091422',
          800: '#070F19',
          900: '#050A10',
        },

        // Secondary / Action Elements: #1E3E62
        'deep-blue': {
          DEFAULT: '#1E3E62',
          50: '#E8ECF1',
          100: '#D1D9E3',
          200: '#A3B3C7',
          300: '#758DAB',
          400: '#47678F',
          500: '#1E3E62',
          600: '#183254',
          700: '#122546',
          800: '#0C1838',
          900: '#060B1A',
        },

        // Accent / Success Indicators: #008080 (Teal/Mint Tua)
        'teal': {
          DEFAULT: '#008080',
          50: '#E6F5F5',
          100: '#CCEEEE',
          200: '#99DDDD',
          300: '#66CCCC',
          400: '#33BBBB',
          500: '#008080',
          600: '#006666',
          700: '#004D4D',
          800: '#003333',
          900: '#001A1A',
        },

        // Background Base: #F4F6F9
        'base-bg': '#F4F6F9',

        // Containers / Cards Surface: #FFFFFF
        'card': '#FFFFFF',

        // Border Colors
        'border-light': '#E5E7EB',
        'border-slate': '#E2E8F0',

        // Text Colors
        'text-primary': '#0B192C',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',

        // Status Colors - Redesigned with new palette
        'success': '#008080',
        'success-bg': '#E6F5F5',
        'warning': '#D97706',
        'warning-bg': '#FFFBEB',
        'danger': '#DC2626',
        'danger-bg': '#FEF2F2',

        // Brand Colors
        'brand': {
          primary: '#1E3E62',
          accent: '#008080',
        },
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        // NO SHADOWS - Flat Premium Design
        // All elements use border-thin separators instead
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderWidth: {
        'thin': '1px',
      },
    },
  },
  plugins: [],
}
