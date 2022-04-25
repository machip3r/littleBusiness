import { getAuth } from "firebase/auth";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rules: {
      required: [(v) => !!v || "Campo requerido"],
      number: [
        (v) => !!v || "Campo requerido",
        (v) => (Number(v) > 0 && Number(v) <= 9999999999) || "Número inválido",
      ],
      email: [
        (v) => !!v || "Campo requerido",
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Campo requerido",
      ],
    },
    user: null,
  },

  mutations: {
    setSession(state, payload) {
      state.user = payload;
    },
  },
  getters: {
    getName(state) {
      return state.user.displayName;
    },
    getAccesToken(state) {
      return state.user.accesToken;
    },
    isAuth(state) {
      if (state.user) return true;
      else return false;
    },
  },
  actions: {},
  modules: {},
});
