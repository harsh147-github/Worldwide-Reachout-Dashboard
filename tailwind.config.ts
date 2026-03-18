import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#06060B',
          secondary: '#0C0C14',
          tertiary: '#12121E',
          elevated: '#181828',
          hover: '#1E1E32',
        },
        fg: {
          primary: '#E8E4DC',
          secondary: '#A09C94',
          muted: '#6B6760',
          dim: '#3D3A36',
        },
        accent: {
          DEFAULT: '#E85D3A',
          hover: '#F06A48',
          muted: 'rgba(232, 93, 58, 0.15)',
          glow: 'rgba(232, 93, 58, 0.08)',
        },
        status: {
          identified: '#6B7280',
          researched: '#8B5CF6',
          drafted: '#F59E0B',
          sent: '#3B82F6',
          followed_up: '#6366F1',
          replied: '#10B981',
          interview: '#06B6D4',
          offer: '#22C55E',
          rejected: '#EF4444',
          not_interested: '#9CA3AF',
          archived: '#4B5563',
        },
        priority: {
          critical: '#EF4444',
          high: '#F59E0B',
          medium: '#3B82F6',
          low: '#6B7280',
        },
        region: {
          japan: '#E85D3A',
          europe: '#3B82F6',
          north_america: '#8B5CF6',
          uk: '#10B981',
          australia: '#F59E0B',
          asia: '#06B6D4',
          middle_east: '#EC4899',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'count-up': 'countUp 1.5s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { from: { opacity: '0', transform: 'translateX(-12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
};

export default config;
