import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'lightest-blue': '#c4f7fd',
        'light-blue': '#b0edf4',
        'dark-blue': '#0addf8',
        'dark-slate-blue': '#1a2a3b',
        'darkest-slate-blue': '#00161c'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config

