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

        lightblue: "#28BFDB",
        bone: "#F8F0EE",
        lightred: "#EF424C",
        darkblue: "#2D3440",
      },
    },
  },
  icons: {
    iconfont: "fa",
  },
});
