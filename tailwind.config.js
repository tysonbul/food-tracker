/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#f8f6f0',
          surface: '#ffffff',
          hover: '#f0ece4',
          border: '#e2ddd4',
          accent: '#4a9e6b',
          'accent-hover': '#3d8a5b',
          'accent-dim': 'rgba(74, 158, 107, 0.12)',
          'accent-text': '#ffffff',
          sidebar: '#f3f0e8',
          muted: '#8a9a8c',
          text: '#2d3a2e',
          'text-secondary': '#4a5a4c',
          'text-muted': '#8a9a8c',
          'tag-bg': '#eae5db',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, 8px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
