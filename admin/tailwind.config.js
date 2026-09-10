/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nykaa: {
          pink: '#f43f5e',
          purple: '#8b5cf6',
          bg: 'var(--nykaa-bg)',
          surface: 'var(--nykaa-surface)',
          text: 'var(--nykaa-text)',
          'text-muted': 'var(--nykaa-text-muted)',
          border: 'var(--nykaa-border)',
          dark: '#0f172a',
          card: 'var(--glass-bg)',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
