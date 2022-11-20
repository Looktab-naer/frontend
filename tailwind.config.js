// default settings can be found here
// https://unpkg.com/browse/tailwindcss@2.2.17/stubs/defaultConfig.stub.js

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // or 'false' or 'class'
  theme: {
  
    colors: {
    },
    fontFamily: {
      // sans: ['Graphik', 'sans-serif'],
      // serif: ['Merriweather', 'serif'],
    },
    extend: {
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
 
};
