<template>
  <div class="pa-8">
    <!-- Header (search bar and nav) -->
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
            <v-btn class="mx-2" fab dark large color="lightblue" elevation="0">
              <v-icon color="darkblue">fas fa-store</v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="this.cart.o_products.length > 0">
            <v-badge
              color="lightred"
              overlap
              :content="this.cart.o_products.length"
            >
              <v-btn
                class="mx-2"
                fab
                dark
                large
                color="darkblue"
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
              color="darkblue"
              @click="orderDialog = true"
              elevation="0"
            >
              <v-icon color="bone">fas fa-shopping-cart</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn class="mx-2" fab dark large color="darkblue" elevation="0">
              <v-icon color="bone">fas fa-user</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div class="d-flex mb-4">
      <h2>Categorías</h2>
    </div>

    <!-- Category buttons (they do nothing) -->
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

    <!-- All products -->
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

    <!-- Product Detail Dialog (change to component) -->
    <v-dialog
      v-model="productDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card elevation="0">
        <!-- Dialog toolbar -->
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

        <!-- Product Details dialog component -->
        <ProductDetails @close-dialog="closeDialog()" :product="product" />
      </v-card>
    </v-dialog>

    <!-- Order Detail Dialog (change to component) -->
    <v-dialog
      v-model="orderDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card elevation="0">
        <!-- Header -->
        <v-row class="pa-4 align-center">
          <v-col cols="1" class="ma-0">
            <v-btn
              @click="orderDialog = false"
              fab
              elevation="0"
              color="darkblue"
            >
              <v-icon color="bone">fas fa-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="9" class="ma-0">
            <h1>Carrito de compras</h1>
            <h4 class="font-weight-light">{{ date }}</h4>
          </v-col>
          <v-col cols="1" class="ma-0">
            <v-chip class="pa-4" large text-color="bone" color="darkblue">
              Something
            </v-chip>
          </v-col>
          <v-col cols="1">
            <v-btn fab elevation="0" color="lighter_red" @click="resetOrder()">
              <v-icon color="lightred">fas fa-trash</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Ordered Products -->
        <OrderDetails :key="update" />
      </v-card>
    </v-dialog>
    <v-btn @click="logOut()" large color="error">Cerrar sesión</v-btn>
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex";
import {Product} from "/firebaseAPI/controllers/product.js";
import ProductDetails from "../../components/ProductDetails.vue";
import OrderDetails from "../../components/OrderDetails.vue";

export default {
  name: "Products",

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
        {name: "All", icon: "fas fa-globe"},
        {name: "Food", icon: "fas fa-utensils"},
        {name: "Clothes", icon: "fas fa-tshirt"},
        {name: "Art", icon: "fas fa-paint-brush"},
        {name: "Services", icon: "fas fa-handshake"},
        {name: "All", icon: "fas fa-globe"},
        {name: "Food", icon: "fas fa-utensils"},
        {name: "Clothes", icon: "fas fa-tshirt"},
        {name: "Art", icon: "fas fa-paint-brush"},
        {name: "Services", icon: "fas fa-handshake"},
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

    // Adds zeros to the date so it has a consistant format.
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
