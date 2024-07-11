module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './outside-directory/**/*.{vue,js,ts,jsx,tsx}' 
  ],
  theme: {
    extend: {
      colors: {
        purple: '#6C63FF'
      },
      fontFamily: {
        Dana: 'Dana',
        DanaMadium: 'Dana Madium',
        DanaDemiBold: 'Dana DemiBold'
      }
    }
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *')
    }
  ]
}
