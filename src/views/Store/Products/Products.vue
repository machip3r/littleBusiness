<template>
  <div class="pa-8">
    <div class="d-flex justify-space-between align-center">
      <h1>Descubre</h1>
      <v-spacer></v-spacer>
      <v-text-field
        label="Buscar producto"
        color="primary"
        background-color="secondary"
        append-icon="fas fa-search"
        filled
        rounded
        dense
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn class="button-fab rounded-circle" color="accent"></v-btn>
      <v-btn class="button-fab rounded-circle" color="accent" dense large
        ><v-icon>fa-shopping-cart</v-icon></v-btn
      >
      <v-btn class="button-fab rounded-circle" color="accent" dense large
        ><v-icon>fas fa-user</v-icon></v-btn
      >
    </div>

    <div class="d-flex mb-4">
      <h2>Categorías</h2>
    </div>

    <div class="d-flex justify-space-around">
      <v-icon>fas fa-fork</v-icon>
      <v-btn
        width="120"
        height="120"
        class="gradient-background"
        elevation="0"
        rounded
        v-for="(category, index) in categories"
        :key="index"
      >
        <div class="flex-column">
          <v-icon size="55">{{ category.icon }}</v-icon>
          <h5>
            {{ category.name }}
          </h5>
        </div>
      </v-btn>
    </div>

    <div class="d-flex flex-wrap my-4">
      <v-card
        width="169"
        height="230"
        v-for="(product, index) in allProducts"
        :key="index"
        class="ml-4 mb-5"
        @click="seeProduct(product)"
      >
        <v-img height="169" :src="product.p_photo"></v-img>
        <h5>${{ product.p_price }}</h5>
        <p>{{ product.p_name }}</p>
      </v-card>
    </div>

    <v-dialog
      v-model="productDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card elevation="0">
        <div class="d-flex pa-4 align-center">
          <v-btn
            class=""
            @click="productDialog = false"
            fab
            elevation="0"
            color="darkblue"
          >
            <v-icon color="bone">fas fa-arrow-left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-chip class="pa-4" large text-color="bone" color="darkblue">{{
            product.p_name
          }}</v-chip>
        </div>
        <!-- <ProductDetails :product="product" /> -->

        <div class="d-flex pa-10">
          <v-img
            max-width="30%"
            max-height="30%"
            contain
            lazy-src="https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/large/public/2021-10/los-mejores-juegos-de-perritos-cachorros-por-mes-de-edad.png?itok=UNEbd6Xh"
            :src="product.p_photo"
          ></v-img>
          <div class="text-justify ml-4 pa-2" max-width="60%">
            <h1>{{ product.p_name }}</h1>
            <h4>Descripción</h4>
            <p>
              {{ product.p_description }}
            </p>
            <h1>$ {{ parseFloat(product.p_price).toFixed(2) }} c/u</h1>
            <div class="d-flex ma-4 align-center">
              <!-- Incrementador y botón de ordenar -->
              <div>
                <!-- Incrementador -->
                <button style="background-color: var(--bone); width: 80px">
                  -
                </button>
                <input
                  style="background-color: var(--bone)"
                  type="number"
                  disabled
                />
                <button style="background-color: var(--bone); width: 80px">
                  +
                </button>
              </div>

              <!-- Order Button -->
              <v-btn class="ml-4" @click="addToCart(product.id_product)">
                <v-icon>fas fa-rocket</v-icon>
                <span>Order</span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Product } from "/firebaseAPI/controllers/product.js";
import ProductDetails from "../../../components/ProductDetails.vue";

export default {
  name: "Products",
  components: {
    ProductDetails,
  },
  data() {
    return {
      productDialog: false,
      product: {
        id_user: 1,
        id_product: 0,
        p_photo: null,
        p_name: "",
        p_price: 0,
        p_description: "",
        p_category: "",
        p_saved: false,
      },
      order: {
        id_order: 1,
        id_business: 1,
        id_productsList: [],
        o_datetime: "",
        o_status: false,
      },
      cart: {
        id_orderedProducts: 0,
        id_product: [],
        op_quantity: 0,
      },
      allProducts: [],
      categories: [
        { name: "All", icon: "fas fa-globe" },
        { name: "Food", icon: "fas fa-utensils" },
        { name: "Clothes", icon: "fas fa-tshirt" },
        { name: "Art", icon: "fas fa-paint-brush" },
        { name: "Services", icon: "fas fa-handshake" },
        { name: "All", icon: "fas fa-globe" },
        { name: "Food", icon: "fas fa-utensils" },
        { name: "Clothes", icon: "fas fa-tshirt" },
        { name: "Art", icon: "fas fa-paint-brush" },
        { name: "Services", icon: "fas fa-handshake" },
      ],
    };
  },

  async created() {
    await this.readDocuments();
  },

  methods: {
    async readDocuments() {
      const P = new Product();
      await P.readProducts().then(
        (res) => (this.allProducts = P.docsObjectToArray(res))
      );
    },

    seeProduct(item) {
      this.product = item;
      this.productDialog = true;
    },
  },
};
</script>

<style lang="css">
@import "../../../styles/main.css";
</style>
