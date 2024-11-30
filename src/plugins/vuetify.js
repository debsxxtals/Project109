// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";


// Vuetify
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

export default createVuetify({
  theme: {
    defaultTheme: "light", // Set the default theme to dark
    themes: {
      dark: {
        dark: true, // Indicate that this is a dark theme
        colors: {
          primary: "#D7B43D", // Set the primary color for dark theme
          secondary: "#41BBB6", // Example secondary color
          background: "#08544f",
          // Add more custom colors here if needed
        },
      },
      light: {
        dark: false,
        colors: {
          primary: "#FFC107 ", // Set the primary color for dark theme
          secondary: "#41BBB6", // Example secondary color
          background: "#08544f",
          // Add more custom colors here if needed
        },
      },
    },
  },
});
