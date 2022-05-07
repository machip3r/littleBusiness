import {getAuth} from "firebase/auth";
import Vue from "vue";
import Vuex from "vuex";
import {User} from "../../firebaseAPI/controllers/user";

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
    async setSession(state, payload) {
      localStorage.setItem("accessToken", JSON.stringify(payload.accessToken));

      let doc = await User.getAdditionalDataUser(payload.uid);

      let userData = {
        name: payload.displayName,
        photo: payload.photoURL,
        uid: payload.uid,
        type: doc.type,
      };
      this.state.user = userData;
      window.location.reload();
    },
    logOut() {
      localStorage.removeItem("accessToken");
      this.state.user = null;
      window.location.reload();
    },
  },
  getters: {
    getName(state) {
      return state.user.displayName;
    },
    getAccessToken(state) {
      return localStorage.getItem("accessToken");
    },
  },
  actions: {},
  modules: {},
});
