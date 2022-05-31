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
              <OrderDetails />
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
      <div>
        <v-card
          class="mx-8 pb-3"
          flat
          width="500"
          elevation="3"
          @click="orderDialog = true"
        >
          <v-toolbar class="elevation-0 gradient-background">
            <div>
              <v-badge color="green"></v-badge>
            </div>
            <v-spacer></v-spacer>
            <v-toolbar-title>Stickers Cool</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>
              <v-icon>far fa-calendar</v-icon>
              16 Apr 2021
            </v-toolbar-title>
          </v-toolbar>

          <v-row class="my-3 px-8">
            <v-col cols="7">Total</v-col>
            <v-spacer></v-spacer>
            <v-col cols="3">$10.00 MXN</v-col>
          </v-row>
          <v-card class="ma-1" color="secondary" elevation="0">
            <v-row class="px-8">
              <v-col cols="2">2x</v-col>
              <v-col cols="7">Stickers L</v-col>
              <v-col cols="3">$10.00 MXN</v-col>
            </v-row>
          </v-card>
        </v-card>
      </div>
    </v-row>
  </div>
</template>

<script>
import { Order } from "/firebaseAPI/controllers/order.js";
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
    };
  },

  computed: {},

  async created() {
    await this.readDocuments();
  },

  methods: {
    async readDocuments() {
      const O = new Order();
      await O.readOrders().then(
        (res) => (this.allOrders = O.docsObjectToArray(res))
      );
    },
  },

  methods: {},
};
</script>

<style></style>
