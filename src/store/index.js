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
    cart: {
      // {
      //   id_order: "",
      //   id_user: 0,
      //   o_products: [{ id_product: 0, op_quantity: 0 }],
      //   o_datetime: "",
      //   o_status: "",
      // },
    },
  },

  mutations: {
    setSession(state, payload) {
      state.user = payload;
    },

    addOrder(state, payload) {
      state.cart = payload;
      console.log("Cart from Store: ", state.cart);
      if (state.cart === {}) {
        state.cart = payload;
        console.log("From Store: Created new order");
      } else {
        console.log("From Store: Existing order, adding only products");
      }
    },

    addProductsToOrder(state, payload) {
      let products = state.cart.o_products;
      const PRODUCTS_SIZE = products.lenght;

      console.log("Payload from Store: ", payload);

      // for (let i = 0; i < PRODUCTS_SIZE; i++) {
      //   if (payload[i].id_product === state.cart.o_products[0].id_product) {
      //     console.log(
      //       `Product (${products[i].id_product}) already existing. Adding ${products[i].op_quantity} to it (before: ${products})`
      //     );
      //   }
      // }

      // products.push(payload);
      // console.log("From store: ", products);
    },

    resetOrders(state) {
      state.cart = [];
      console.log(state.cart);
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

  actions: {
    addOrder({ commit }, cart) {
      commit("addOrder", cart);
    },

    addProductsToOrder({ commit }, product) {
      commit("addProductsToOrder", product);
    },

    resetOrders({ commit }) {
      commit("resetOrders");
    },
  },

  modules: {},
});
