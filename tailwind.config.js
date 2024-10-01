/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        colors: {
            'ava-primary': '#5bcbf5',
            'bar-bg': '#9cbab4',
            'bar-fill': '#009579'
        },
        padding: {
            '02': '0.2rem'
        },
        fontFamily: {
            quick: ['Quicksand', 'sans-serif']
        },
        height: {
            'bottom-bar': '30dvh',
            'leaderboard': '70dvh'
        }
    },
  },
  plugins: [],
}

