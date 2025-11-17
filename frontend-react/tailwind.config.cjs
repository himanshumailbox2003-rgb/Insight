module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-\[var\(--.*\)\]/,
    },
    {
      pattern: /text-\[var\(--.*\)\]/,
    },
    {
      pattern: /shadow-\[var\(--.*\)\]/,
    },
  ],
  plugins: [],
}
