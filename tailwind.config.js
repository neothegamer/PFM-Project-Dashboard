/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // Main dark theme
        navy: {
          deep: '#07111F',
          secondary: '#0D1B2A',
          card: '#10263A',
          elevated: '#143047',
        },

        // Brand colours
        brand: {
          purple: '#8B5CF6',
          'purple-hover': '#7C3AED',
          blue: '#3B82F6',
          teal: '#2DD4BF',
          mint: '#2DD4BF',
          cyan: '#22D3EE',

          // Compatibility colours used by generated components
          text: '#F8FAFC',
          muted: '#94A3B8',
          success: '#34D399',
          danger: '#FB7185',
          warning: '#FBBF24',
        },

        // Text colours
        text: {
          main: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },

        // Border
        border: {
          DEFAULT: '#1E3A4F',
        },

        // Status colours
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#FB7185',

        // Finance colours
        income: '#2DD4BF',
        expense: '#FB7185',

        // Compatibility with one older component
        muted: '#64748B',
      },

      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },

      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.3), 0 1px 2px -1px rgba(0,0,0,0.3)',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(139,92,246,0.15)',
      },

      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'progress-fill': 'progressFill 1s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(16px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },

        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-16px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },

        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
        },

        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
    },
  },

  plugins: [],
};