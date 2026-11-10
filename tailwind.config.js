/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rs: {
          red: '#ef4444',    // Corda 6 (E / Mi grave)
          yellow: '#eab308', // Corda 5 (A / Lá)
          blue: '#3b82f6',   // Corda 4 (D / Ré)
          orange: '#f97316', // Corda 3 (G / Sol)
          green: '#22c55e',  // Corda 2 (B / Si)
          purple: '#a855f7', // Corda 1 (E / Mi agudo)
          dark: '#0B0F17',
          panel: '#151D2A',
          card: '#1E293B',
          fretboard: '#1e1b18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

