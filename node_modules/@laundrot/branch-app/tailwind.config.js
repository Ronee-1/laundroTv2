/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#F1F5F9',
        surface: '#FFFFFF',
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#1E2F7A',
        },
        secondary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        status: {
          safe: '#047857',
          'safe-bg': '#ECFDF5',
          warn: '#B45309',
          'warn-bg': '#FFFBEB',
          crit: '#BE123C',
          'crit-bg': '#FFF1F2',
        },
      },
      boxShadow: {
        'card': '0 8px 30px rgb(0 0 0 / 0.02)',
        'card-hover': '0 12px 40px rgb(0 0 0 / 0.06)',
        'soft': '0 1px 3px rgb(0 0 0 / 0.04)',
        'elevated': '0 20px 60px rgb(0 0 0 / 0.08)',
      },
      borderRadius: {
        '4xl': '24px',
      },
    },
  },
  plugins: [],
}
