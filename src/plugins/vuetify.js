import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#2790BA",
        secondary: "#EDE8CA",
        third: "#FBFAF1",
        accent: "#FECD48",
        error: "#FF5252",
        info: "#6FB5D1",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
  lang: {
    locales: {es},
    current: "es",
  },
  icons: {
    iconfont: "fa",
  },
});
