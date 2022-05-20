<template>
  <div class="pa-8">
    <v-row align="center">
      <v-col>
        <h1>Descubre</h1>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-text-field
          label="Buscar producto"
          color="primary"
          background-color="secondary"
          append-icon="fas fa-search"
          filled
          rounded
          dense
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-row>
          <v-col>
            <v-btn class="mx-2" fab dark large color="accent" elevation="0">
              <v-icon color="primary">fas fa-store</v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="this.cart.o_products.length > 0">
            <v-badge
              color="error"
              overlap
              :content="this.cart.o_products.length"
            >
              <v-btn
                class="mx-2 button-top-right"
                fab
                dark
                large
                color="primary"
                @click="orderDialog = true"
                elevation="0"
              >
                <v-icon>fas fa-shopping-cart</v-icon>
              </v-btn>
            </v-badge>
          </v-col>
          <v-col v-else>
            <v-btn
              class="mx-2"
              fab
              dark
              large
              color="primary"
              @click="orderDialog = true"
              elevation="0"
            >
              <v-icon color="secondary">fas fa-shopping-cart</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn class="mx-2" fab dark large color="primary" elevation="0">
              <v-icon color="secondary">fas fa-user</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

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
            color="primary"
          >
            <v-icon color="secondary">fas fa-arrow-left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-chip class="pa-4" large text-color="secondary" color="primary">{{
            product.p_name
          }}</v-chip>
        </div>

        <ProductDetails @close-dialog="closeDialog()" :product="product" />
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="orderDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card elevation="0">
        <v-row class="pa-4 align-center">
          <v-col cols="1" class="ma-0">
            <v-btn
              @click="orderDialog = false"
              fab
              elevation="0"
              color="primary"
            >
              <v-icon color="secondary">fas fa-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="9" class="ma-0">
            <h1>Carrito de compras</h1>
            <h4 class="font-weight-light">{{ date }}</h4>
          </v-col>
          <v-col cols="1" class="ma-0">
            <v-chip class="pa-4" large text-color="secondary" color="primary">
              Something
            </v-chip>
          </v-col>
          <v-col cols="1">
            <v-btn fab elevation="0" color="lighterred" @click="resetOrder()">
              <v-icon color="error">fas fa-trash</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <OrderDetails :key="update" />
      </v-card>
    </v-dialog>
    <v-btn @click="logOut()" large color="error">Cerrar sesión</v-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Product from "/firebaseAPI/controllers/product.js";
import ProductDetails from "../components/ProductDetails.vue";
import OrderDetails from "../components/OrderDetails.vue";

export default {
  name: "Home",

  components: {
    ProductDetails,
    OrderDetails,
  },

  data() {
    return {
      productDialog: false,
      orderDialog: false,
      date: "",
      update: 0,
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

  computed: {
    ...mapState(["cart"]),
  },

  async created() {
    await this.readDocuments();
    this.date = this.getDate();
  },

  methods: {
    ...mapActions(["resetOrder"]),

    async readDocuments() {
      const P = new Product();
      await P.readProducts().then(
        (res) => (this.allProducts = P.docsObjectToArray(res))
      );
    },

    closeDialog() {
      this.productDialog = false;
      this.update++;
    },

    seeProduct(item) {
      this.product = item;
      this.productDialog = true;
    },

    leadingZeros(number) {
      return number.toString().padStart(2, "0");
    },

    getDate() {
      const today = new Date();
      return `${this.leadingZeros(today.getDate())}/${this.leadingZeros(
        today.getMonth() + 1
      )}/${today.getFullYear()}`;
    },

    async logOut() {
      try {
        await this.$store.commit("logOut");
      } catch (error) {
        this.messageError = error;
      }
    },
  },
};
</script>
