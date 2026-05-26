/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pet: {
          rosa: '#D63384',
          verde: '#7DBE42',
          bege: '#FCE3B5',
          laranja: '#F39237',
          azul: '#00A896',
        }
      }
    },
  },
  plugins: [],
}