import Vue from "vue";
import Vuex from "vuex";
import { User } from "/firebaseAPI/controllers/user.js";

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
    accessToken: null,
    sellerView: null,
    cart: {
      id_order: "",
      id_user: 0,
      o_products: [],
      o_datetime: "",
      o_status: "p",
    },
  },

  mutations: {
    async setSession(state, payload) {
      state.accessToken = payload.accessToken;

      let doc = await User.getAdditionalDataUser(payload.uid);

      let userData = {
        name: payload.displayName,
        photo: payload.photoURL,
        uid: payload.uid,
        type: doc.type,
      };

      state.user = userData;
      state.sellerView = false;
      localStorage.setItem("logged", true);
    },
    async setAccess(state, payload) {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
      //state.sellerView = false;
    },
    async logOut(state, payload) {
      state.accessToken = null;
      state.user = null;
      state.sellerView = null;
      localStorage.removeItem("logged");
      await User.logout();
    },
    async updateName(state, payload) {
      await User.updateUserName(payload);
      if (payload !== null) state.user.name = payload;
    },
    async updatePhoto(state, payload) {
      return new Promise((resolve) => {
        User.updateUserPhoto(payload).then((url) => {
          resolve((state.user.photo = url));
        });
      });
    },
    updateSellerView(state, payload) {
      state.sellerView = payload;
    },
    addOrder(state, payload) {
      state.cart = payload;
    },

    addProducts(state, payload) {
      let products = state.cart.o_products;

      products.push(payload);
    },

    deleteProduct(state, payload) {
      const ORDER_PRODUCTS_SIZE = state.cart.o_products.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
        if (payload == state.cart.o_products[i].id_product) {
          state.cart.o_products.splice(i, 1);
          break;
        }
      }
    },

    incrementQuantity(state, payload) {
      const ORDER_PRODUCTS_SIZE = state.cart.o_products.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
        if (payload.id_product == state.cart.o_products[i].id_product) {
          state.cart.o_products[i].op_quantity += payload.op_quantity;
          break;
        }
      }
    },

    decrementQuantity(state, payload) {
      const ORDER_PRODUCTS_SIZE = state.cart.o_products.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
        if (payload.id_product == state.cart.o_products[i].id_product) {
          state.cart.o_products[i].op_quantity =
            state.cart.o_products[i].op_quantity > 1
              ? state.cart.o_products[i].op_quantity - payload.op_quantity
              : 1;

          break;
        }
      }
    },

    resetOrder(state) {
      state.cart = {
        id_order: "",
        id_user: 0,
        o_products: [],
        o_datetime: "",
        o_status: "p",
      };
    },
  },

  getters: {
    getDataUser(state) {
      return state.user;
    },

    getAccessToken(state) {
      //return state.accessToken;
      if (state.accessToken === null) return localStorage.getItem("logged");
      else return state.accessToken;
    },

    // This is not in chikis' commit
    isAuth(state) {
      if (state.user) return true;
      else return false;
    },
  },

  actions: {
    updateUserName({ commit }, name) {
      return new Promise((resolve) => {
        resolve(commit("updateName", name));
      });
    },
    updateUserPhoto({ commit }, photo) {
      commit("updatePhoto", photo);
    },
    loadAccess({ commit }, access) {
      return new Promise((resolve) => {
        resolve(commit("setAccess", access));
      });
    },
    removeAccess({ commit }) {
      return new Promise((resolve) => {
        resolve(commit("logOut"));
      });
    },
    modifyView({ commit }, data) {
      commit("updateSellerView", data);
    },
    addOrder({ commit }, cart) {
      commit("addOrder", cart);
    },

    addProducts({ commit }, product) {
      commit("addProducts", product);
    },

    incrementQuantity({ commit }, { id_product, op_quantity }) {
      commit("incrementQuantity", { id_product, op_quantity });
    },

    decrementQuantity({ commit }, { id_product, op_quantity }) {
      commit("decrementQuantity", { id_product, op_quantity });
    },

    deleteProduct({ commit }, id_product) {
      commit("deleteProduct", id_product);
    },

    resetOrder({ commit }) {
      commit("resetOrder");
    },
  },
  modules: {},
});
