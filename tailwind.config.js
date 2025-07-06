import primeui from 'tailwindcss-primeui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
   "./src/**/*.{js,jsx,ts,tsx}",
    './node_modules/primeng/**/*.{js,ts}',
     "./node_modules/tailwindcss-primeui/**/*.{js,ts}" 
  ],
  plugins: [
    primeui()
  ],
};