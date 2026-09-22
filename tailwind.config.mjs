import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Warm, trustworthy neutral + terracotta accent — placeholder brand
        // palette until Claude Design tokens are exported. Swap here once
        // final brand colors are picked; every component reads from these
        // names rather than hardcoded hex values.
        sand: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e7ddd0',
          300: '#d6c5ae',
        },
        ink: {
          900: '#1b1a17',
          700: '#3a372f',
          500: '#686355',
        },
        amsi: {
          DEFAULT: '#b55a3a',
          dark: '#8f4429',
          light: '#e8a483',
        },
        referral: {
          DEFAULT: '#2f6b4f',
          bg: '#e7f2ec',
        },
        sponsored: {
          DEFAULT: '#7a5c1e',
          bg: '#f5efdd',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [typography],
};
