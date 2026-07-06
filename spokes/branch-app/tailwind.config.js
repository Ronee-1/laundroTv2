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
        // MATERIAL DESIGN 3 COLOR SYSTEM
        // Based on Material You Design Language
        // ============================================

        // Primary - Deep Indigo
        'md-primary': {
          DEFAULT: '#15157d',
          50: '#e8e8fc',
          100: '#c0c1ff',
          200: '#9999fe',
          300: '#7272fe',
          400: '#4f54b4',
          500: '#2e3192',
          600: '#15157d',
          700: '#0f1063',
          800: '#0a0a4a',
          900: '#050530',
        },

        // Secondary - Vibrant Blue
        'md-secondary': {
          DEFAULT: '#0056c6',
          50: '#e6f0ff',
          100: '#b0c6ff',
          200: '#7a9bff',
          300: '#4471ff',
          400: '#2e55cc',
          500: '#1e3d99',
          600: '#152966',
          700: '#0d1533',
          800: '#04000f',
        },

        // Tertiary - Deep Purple
        'md-tertiary': {
          DEFAULT: '#0c0092',
          50: '#e6e0ff',
          100: '#c0bfff',
          200: '#9999ff',
          300: '#7373fe',
          400: '#5252cc',
          500: '#373799',
          600: '#1f1f66',
          700: '#0a0a33',
        },

        // Surface Colors
        'md-surface': '#f8f9ff',
        'md-surface-container': '#e5eeff',
        'md-surface-container-low': '#eff4ff',
        'md-surface-container-high': '#dce9ff',
        'md-surface-container-highest': '#d3e4fe',

        // On Colors (text on surface)
        'md-on-surface': '#0b1c30',
        'md-on-surface-variant': '#464652',

        // On Primary
        'md-on-primary': '#ffffff',

        // Outline Colors
        'md-outline': '#777683',
        'md-outline-variant': '#c7c5d4',

        // Error Colors
        'md-error': '#ba1a1a',
        'md-error-container': '#ffdad6',
        'md-on-error': '#ffffff',
        'md-on-error-container': '#93000a',

        // Success (Teal)
        'md-success': '#0d9488',
        'md-success-light': '#ccfbf1',

        // Warning (Amber)
        'md-warning': '#d97706',
        'md-warning-light': '#fef3c7',

        // Extended Teal
        'teal': {
          DEFAULT: '#14b8a6',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },

        // Navy (legacy support)
        'navy': {
          DEFAULT: '#15157d',
          50: '#e8e8fc',
          100: '#c0c1ff',
          200: '#9999fe',
          300: '#7272fe',
          400: '#4f54b4',
          500: '#2e3192',
          600: '#15157d',
          700: '#0f1063',
          800: '#0a0a4a',
          900: '#050530',
        },

        // Deep Blue (legacy support)
        'deep-blue': {
          DEFAULT: '#0056c6',
          50: '#e6f0ff',
          100: '#b0c6ff',
          200: '#7a9bff',
          300: '#4471ff',
          400: '#2e55cc',
          500: '#1e3d99',
          600: '#152966',
          700: '#0d1533',
          800: '#04000f',
        },

        // Background Base
        'base-bg': '#f8f9ff',

        // Containers / Cards Surface
        'card': '#ffffff',

        // Border Colors
        'border-light': '#e5e7eb',
        'border-slate': '#c7c5d4',

        // Text Colors
        'text-primary': '#0b1c30',
        'text-secondary': '#464652',
        'text-muted': '#94a3b8',

        // Status Colors
        'success': '#0d9488',
        'success-bg': '#ccfbf1',
        'warning': '#d97706',
        'warning-bg': '#fef3c7',
        'danger': '#ba1a1a',
        'danger-bg': '#ffdad6',

        // Brand Colors
        'brand': {
          primary: '#15157d',
          accent: '#14b8a6',
        },
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
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
        'md': '0 2px 8px rgba(21, 21, 125, 0.08)',
        'lg': '0 4px 16px rgba(21, 21, 125, 0.12)',
        'xl': '0 8px 32px rgba(21, 21, 125, 0.16)',
        'card': '0 2px 12px rgba(21, 21, 125, 0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        'gutter': '24px',
      },
      borderWidth: {
        'thin': '1px',
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
