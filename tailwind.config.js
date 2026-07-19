/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      backgroundClip: ['text'],
      fontFamily: {
        poppins: ['Poppins-Regular', 'sans-serif'],
        "poppins-bold": ["Poppins-Bold", "sans-serif"],
        "poppins-extrabold": ["Poppins-ExtraBold", "sans-serif"],
        "poppins-semibold": ["Poppins-SemiBold", "sans-serif"],
        "poppins-medium": ["Poppins-Medium", "sans-serif"],
        "poppins-light": ["Poppins-Light", "sans-serif"],
      },
      colors: {
        "primary": {
          100: '#D33C280A',
          200: '#D33C281A',
          300: '#D33C28'
        },
        "secondary": {
          100: '#A05FD80A',
          200: '#A05FD81A',
          300: '#A05FD8'
        },
        "tertiary": {
          100: '#3DCDF50A',
          200: '#3DCDF51A',
          300: '#3DCDF5'
        },
        accent: {
          100: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
}
