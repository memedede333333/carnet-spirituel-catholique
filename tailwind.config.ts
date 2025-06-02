import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // On utilise les variables CSS définies dans globals.css
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        'accent-dark': 'var(--accent-dark)',
        gold: 'var(--gold)',
        'gold-light': 'var(--gold-light)',
        'gold-dark': 'var(--gold-dark)',
        background: 'var(--background)',
        'background-pure': 'var(--background-pure)',
        'background-cream': 'var(--background-cream)',
        text: 'var(--text)',
        'text-light': 'var(--text-light)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Source Sans 3', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-up': 'fadeUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;