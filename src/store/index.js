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
      id_order: "",
      id_user: 0,
      o_products: [],
      o_datetime: "",
      o_status: "Pending",
    },
  },

  mutations: {
    setSession(state, payload) {
      state.user = payload;
    },

    addOrder(state, payload) {
      state.cart = payload;
      console.log("From Store - Created New Order: ", state.cart);
    },

    addProducts(state, payload) {
      let products = state.cart.o_products;

      products.push(payload);
      console.log("From Store - Added New Product: ", payload);
      console.log("From Store - Current Cart: ", state.cart);
    },

    deleteProduct(state, payload) {
      console.log("Payload from Store (deleteProduct): ", payload);

      const ORDER_PRODUCTS_SIZE = state.cart.o_products.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
        if (payload == state.cart.o_products[i].id_product) {
          console.log("From store - Deleting: ", state.cart.o_products[i]);
          state.cart.o_products.splice(i, 1);
          break;
        }
      }
      console.log("From Store - Current Cart: ", state.cart);
    },

    incrementQuantity(state, payload) {
      const ORDER_PRODUCTS_SIZE = state.cart.o_products.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
        if (payload.id_product == state.cart.o_products[i].id_product) {
          console.log(
            `From Store - Incremented ${payload.op_quantity} to product ${state.cart.o_products[i].id_product}`
          );
          state.cart.o_products[i].op_quantity += payload.op_quantity;
          break;
        }
      }

      console.log("From Store - Current cart: ", state.cart);
    },

    decrementQuantity(state, payload) {
      const ORDER_PRODUCTS_SIZE = state.cart.o_products.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
        if (payload.id_product == state.cart.o_products[i].id_product) {
          console.log(
            `From Store - Decremented ${payload.op_quantity} to product ${state.cart.o_products[i].id_product}`
          );
          state.cart.o_products[i].op_quantity -= payload.op_quantity;
          break;
        }
      }

      console.log("From Store - Current cart: ", state.cart);
    },

    resetOrder(state) {
      state.cart = {
        id_order: "",
        id_user: 0,
        o_products: [],
        o_datetime: "",
        o_status: "Pending",
      };
      console.log("From Store - Reseted cart: ", state.cart);
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
      commit("resetOrders");
    },
  },

  modules: {},
});
