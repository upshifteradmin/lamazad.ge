/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: {
          DEFAULT: '#121216',
          muted: '#18181e',
          elevated: '#202028',
          card: '#0f0f13',
        },
        border: {
          subtle: '#23232a',
          active: '#3f3f4e',
          glow: '#d4ff00',
        },
        brand: {
          lime: '#d4ff00', // Volt / Neon Streetwear highlight
          cyan: '#00f2ff', // Cyber-Clean Batumi Sea
          coral: '#ff4655', // Drop Alert Coral
          white: '#fafafa',
          muted: '#8e8e99',
          dark: '#09090b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Georgian', 'FiraGO', 'sans-serif'],
        display: ['Syne', 'FiraGO', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      boxShadow: {
        'neon-lime': '0 0 25px -5px rgba(212, 255, 0, 0.4)',
        'neon-cyan': '0 0 25px -5px rgba(0, 242, 255, 0.35)',
        'cyber-card': '0 8px 30px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-mesh': 'radial-gradient(at 0% 0%, rgba(212, 255, 0, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 242, 255, 0.06) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};
