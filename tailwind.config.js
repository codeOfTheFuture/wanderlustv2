module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "mountain-jump": "url(/assets/images/jumping-mountain.webp)",
        "login-blurred": "url(/assets/images/login-blurred.webp)",
        "settings-blurred": "url(/assets/images/canyons-blurred.webp)",
        "running-in-forest": "url(/assets/images/running-in-forest.webp)",
      },
      colors: {
        "primary-color": "#2196F3",
        "primary-dark-color": "#1976D2",
        "primary-light-color": "#BBDEFB",
        "light-text": "#FFFFFF",
        "primary-text": "#212121",
        "secondary-text": "#757575",
        "accent-color": "#607D8B",
        "divider-color": "#BDBDBD",
        "error-color": "#FF5252",
        "error-dark-color": "#D32F2F",
        "success-color": "#4CAF50",
        "warning-color": "#FFEB3B",
        "info-color": "#2196F3",
      },
    },
  },
  plugins: [],
};
