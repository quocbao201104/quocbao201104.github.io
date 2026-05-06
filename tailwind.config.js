/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#07070b',
          raised: '#0c0c14',
          sunken: '#050507',
          panel: 'rgba(255,255,255,0.02)',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          soft: 'rgba(255,255,255,0.035)',
          strong: 'rgba(255,255,255,0.10)',
          glow: 'rgba(168,85,247,0.22)',
        },
        ink: {
          bright: '#f4f4f7',
          muted: '#b8b8cc',
          dim: '#8585a0',
          faint: '#454560',
        },
        accent: {
          purple: '#a855f7',
          'purple-deep': '#7c3aed',
          'purple-soft': '#c4a3f7',
          cyan: '#67e8f9',
          'cyan-deep': '#22d3ee',
        },
        status: {
          ok: '#34d399',
          warn: '#fbbf24',
          err: '#f87171',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        display: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
      },
      letterSpacing: {
        wider2: '0.18em',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(168,85,247,0.25), 0 8px 30px -10px rgba(168,85,247,0.35)',
        'glow-cyan': '0 0 0 1px rgba(103,232,249,0.25), 0 8px 30px -10px rgba(103,232,249,0.35)',
        'inset-line': 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
        panel:
          '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'radial-purple':
          'radial-gradient(60% 60% at 50% 0%, rgba(168,85,247,0.18) 0%, rgba(168,85,247,0.0) 60%)',
        'radial-cyan':
          'radial-gradient(50% 50% at 100% 100%, rgba(103,232,249,0.10) 0%, rgba(103,232,249,0.0) 60%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.55' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'neural-pulse': {
          '0%, 100%': { opacity: '0.22' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translate3d(0,-2px,0)' },
          '100%': { transform: 'translate3d(0,2px,0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(8px,-12px,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-glow': 'pulse-glow 3.2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 3.2s ease-out infinite',
        'neural-pulse': 'neural-pulse 4s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 14s ease-in-out infinite',
        'cursor-blink': 'cursor-blink 1.05s step-end infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
