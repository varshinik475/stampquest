/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        card: 'var(--card)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        destructive: 'var(--destructive)'
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        display: ['"Trebuchet MS"', '"Segoe UI"', 'sans-serif']
      },
      fontSize: {
        display: ['clamp(2.2rem, 4vw, 4rem)', { lineHeight: '1.1' }],
        hero: ['clamp(1.4rem, 2vw, 2.2rem)', { lineHeight: '1.2' }],
        body: ['1rem', { lineHeight: '1.7' }],
        meta: ['0.75rem', { lineHeight: '1.5' }]
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        soft: '0 18px 45px -22px rgba(15, 23, 42, 0.35)',
        card: '0 16px 40px -24px rgba(15, 23, 42, 0.4)'
      },
      maxWidth: {
        container: 'var(--container-width)'
      }
    }
  },
  plugins: []
};
