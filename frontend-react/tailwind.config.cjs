module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-[var(--bg)]',
    'bg-[var(--card)]',
    'text-[var(--text)]',
    'text-[var(--muted)]',
    'text-[var(--accent)]',
    'shadow-[var(--glass)]',
  ],
  plugins: [],
}
