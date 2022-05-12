import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        /* primary: '#007BFF',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107' */

        primary: "#2D3440",
        secondary: "#F8F0EE",
        accent: "#28BFDB",
        error: "#EF424C",

        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",

        lighterblue: "#b7e9f3",
        lightblue: "#28BFDB",
        darkblue: "#2D3440",

        lighter_red: "#ffd5d5",
        lightred: "#EF424C",

        bone: "#F8F0EE",
      },
    },
  },
  icons: {
    iconfont: "fa",
  },
});
