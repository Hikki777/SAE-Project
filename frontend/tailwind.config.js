/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode via class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo principal
        background: '#020617',
        card: '#0f172a',
        bg: {
          primary: '#020617',
          secondary: '#0f172a',
          tertiary: '#1a1f3a',
        },
        // Acentos principales (Cyan moderno)
        accent: {
          DEFAULT: '#22d3ee',
          light: '#38bdf8',
          dark: '#1557a0',
          muted: 'rgba(34, 211, 238, 0.1)',
        },
        // Textos
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#4a5568',
          light: '#8a96a8',
        },
        // Bordes
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          light: 'rgba(255, 255, 255, 0.1)',
          strong: '#334155',
        },
        // Estados
        status: {
          success: '#22c55e',
          warning: '#eab308',
          error: '#ef4444',
          neutral: '#64748b',
        },
        // Paleta heredada (compatibilidad)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        warning: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        danger: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(34, 211, 238, 0.25)',
        'glow-sm': '0 0 10px rgba(34, 211, 238, 0.15)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'xl2': '16px',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: [
          'Hack Nerd Font Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace'
        ]
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
