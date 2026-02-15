module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D9FF',
        secondary: '#FF006E',
        accent: '#8338EC',
        dark: '#0a0e27',
      },
      fontFamily: {
        arabic: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
