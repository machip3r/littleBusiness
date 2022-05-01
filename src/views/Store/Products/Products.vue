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
          <v-col v-if="o_products.length > 0">
            <v-badge color="lightred" overlap :content="this.cart.length">
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
              <!-- @click="uploadToCart()" -->
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
        <ProductDetails
          v-on:close-dialog="productDialog = false"
          :product="product"
        />
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
            <h4 class="font-weight-light">29/04/2022</h4>
          </v-col>
          <v-col cols="1" class="ma-0">
            <v-chip
              class="pa-4"
              large
              text-color="bone"
              color="darkblue"
              @click="uploadToCart()"
            >
              Something
            </v-chip>
          </v-col>
          <v-col cols="1">
            <v-btn fab elevation="0" color="lighter_red">
              <v-icon color="lightred">fas fa-trash</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Ordered Products -->
        <OrderDetails />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { Product } from "/firebaseAPI/controllers/product.js";
import { Order } from "/firebaseAPI/controllers/order.js";
import ProductDetails from "../../../components/ProductDetails.vue";
import OrderDetails from "../../../components/OrderDetails.vue";

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
        id_order: "",
        id_user: 0,
        o_products: [],
        o_datetime: "",
        o_status: "",
      },
      // quantity: 1, // Pass to state's cart
      o_products: [], // Pass to state's cart
      orderedProducts: [], // Pass to cart component
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
    console.log(this.cart);
    console.log(this.getDateTime());
  },

  methods: {
    ...mapActions(["addOrder", "addProducts", "deleteProducts"]),

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

    deleteFromCart(product) {
      const ORDER_PRODUCTS_SIZE = this.o_products.length;
      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
        if (product.id_product == this.o_products[i].id_product) {
          console.log("Deleting ", this.o_products[i]);
          this.o_products.splice(i, 1);

          break;
        }
      }
    },

    // Maybe move it to the products component.
    getOrderedProducts() {
      const PRODUCTS_SIZE = this.allProducts.length;

      this.o_products.forEach((prod) => {
        console.log("prod.id_product: ", prod.id_product);
        for (let i = 0; i < PRODUCTS_SIZE; i++)
          if (prod.id_product === this.allProducts[i].id_product) {
            this.orderedProducts.push(this.allProducts[i]);
            break;
          }
      });
    },

    // Adds zeros to the date so it has a consistant format.
    leadingZeros(number) {
      return number.toString().padStart(2, "0");
    },

    getDateTime() {
      const today = new Date();
      return `${today.getFullYear()}-${this.leadingZeros(
        today.getMonth() + 1
      )}-${this.leadingZeros(today.getDate())} ${this.leadingZeros(
        today.getHours()
      )}:${this.leadingZeros(today.getMinutes())}:${this.leadingZeros(
        today.getSeconds()
      )}`;
    },
  },
};
</script>

<style lang="css">
@import "../../../styles/main.css";
@import "../../../styles/product.css";
</style>
