<template>
  <div>
    <v-dialog
      v-model="orderDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="elevation-0">
        <div class="pa-4">
          <v-row align="center">
            <v-col cols="1">
              <v-btn
                @click="orderDialog = false"
                fab
                elevation="0"
                color="primary"
              >
                <v-icon color="scondary">fas fa-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10">
              <v-row>
                <v-col><h1>Mi pedido</h1></v-col>
              </v-row>
              <v-row>
                <v-col><h3>16/Apr/2022</h3></v-col>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="1">
              <v-chip class="pa-4" large text-color="secondary" color="primary">
                amip ixula
              </v-chip>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <OrderDetails products="" />
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>

    <v-row class="pt-6 px-6 row-title-home" align="center" justify="center">
      <v-col class="col-title-home">
        <h1>Mis pedidos</h1>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-text-field
          label="Buscar"
          color="primary"
          background-color="secondary"
          append-icon="fas fa-search"
          class="input-search"
          filled
          rounded
          dense
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <div class="mx-auto" v-for="order in allOrders" :key="order.id_order">
        <v-card
          class="ma-8 pb-3"
          flat
          width="500"
          elevation="3"
          @click="orderDialog = true"
        >
          <v-toolbar class="elevation-0 gradient-background">
            <div>
              <v-badge :color="badgeColors[order.o_status]"></v-badge>
            </div>
            <v-spacer></v-spacer>
            <v-toolbar-title>Stickers Cool</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>
              <v-icon>far fa-calendar</v-icon>
              {{ order.o_datetime }}
            </v-toolbar-title>
          </v-toolbar>

          <v-row class="my-3 px-8">
            <v-col cols="7">Total</v-col>
            <v-spacer></v-spacer>
            <v-col cols="3">${{ order.o_total.toFixed(2) }} MXN</v-col>
          </v-row>
          <v-card
            class="ma-1"
            color="secondary"
            elevation="0"
            v-for="product in order.o_products"
            :key="product.id_product"
          >
            <v-row class="px-8">
              <v-col cols="2">{{ product.op_quantity }}x</v-col>
              <v-col cols="7">{{ product.p_name }}</v-col>
              <v-col cols="3">${{ product.p_price }} MXN</v-col>
            </v-row>
          </v-card>
        </v-card>
      </div>
    </v-row>
  </div>
</template>

<script>
import { Order } from "/firebaseAPI/controllers/order.js";
import { Product } from "/firebaseAPI/controllers/product.js";
import OrderDetails from "../components/OrderDetails.vue";

export default {
  name: "Order",

  components: {
    OrderDetails,
  },

  data: () => {
    return {
      orderDialog: false,
      allOrders: [],
      allProducts: [],
      badgeColors: {
        d: "#2D3440",
        p: "green",
        c: "red",
      },
    };
  },

  computed: {},

  async created() {
    // TODO: Filter orders by user, maybe create another method for it.
    await this.getProducts();
    await this.getOrders();
  },

  methods: {
    async getProducts() {
      const P = new Product();
      await P.readProducts().then(
        (res) => (this.allProducts = P.docsObjectToArray(res))
      );
    },

    async getOrders() {
      const O = new Order();
      await O.readOrders().then((res) => {
        this.allOrders = O.docsObjectToArray(res);

        this.allOrders.forEach((order) => {
          let o_total = 0;
          order.o_datetime = this.formatDate(order.o_datetime);

          order.o_products.forEach((orderedProduct) => {
            this.allProducts.forEach((product) => {
              if (orderedProduct.id_product === product.id_product) {
                delete orderedProduct.id_product;
                o_total +=
                  parseInt(product.p_price) *
                  parseInt(orderedProduct.op_quantity);
                Object.assign(orderedProduct, product);
              }
            });
          });
          order.o_total = o_total;
        });
      });
    },

    formatDate(date) {
      const months = [
        "",
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];

      return `${date.substring(8, 10)} ${
        months[+date.substring(5, 7)]
      } ${date.substring(0, 4)}`;
    },
  },
};
</script>

<style></style>
