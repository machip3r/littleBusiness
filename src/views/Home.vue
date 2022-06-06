<template>
  <div>
    <v-row class="pt-6 px-6 row-title-home" align="center" justify="center">
      <v-col class="col-title-home">
        <h1>Descubre</h1>
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
      <!-- <v-spacer></v-spacer>
      <v-col>
        <v-row>
          <v-col>
            <v-btn
              class="button-top-right"
              fab
              dark
              color="primary"
              elevation="0"
              to="/dashboard"
            >
              <v-icon class="button-top-right-icon" color="secondary">
                fas fa-store
              </v-icon>
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
                color="primary"
                elevation="0"
                @click="orderDialog = true"
              >
                <v-icon class="button-top-right-icon" color="secondary"
                  >fas fa-shopping-cart</v-icon
                >
              </v-btn>
            </v-badge>
          </v-col>
          <v-col v-else>
            <v-btn
              class="button-top-right"
              fab
              dark
              color="primary"
              elevation="0"
              @click="orderDialog = true"
            >
              <v-icon class="button-top-right-icon" color="secondary"
                >fas fa-shopping-cart</v-icon
              >
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="button-top-right"
              fab
              dark
              color="primary"
              elevation="0"
            >
              <v-icon class="button-top-right-icon" color="secondary"
                >fas fa-user</v-icon
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-col> -->
    </v-row>

    <div v-if="homeView">
      <div class="d-flex mb-4 px-6">
        <h3>Categorías</h3>
      </div>

      <v-slide-group mandatory class="px-6">
        <v-slide-item
          v-for="(category, index) in categories"
          :key="index"
          v-slot="{ active, toggle }"
        >
          <v-btn
            class="gradient-background button-filter-home"
            elevation="0"
            rounded
            active-class="button-filter-home--active"
            :input-value="active"
            @click="toggle"
          >
            <div class="flex-column">
              <v-icon class="button-filter-icon-home">{{
                category.icon
              }}</v-icon>
              <h5 class="button-filter-text-home">
                {{ category.name }}
              </h5>
            </div>
          </v-btn>
        </v-slide-item>
      </v-slide-group>

      <div class="products-container">
        <v-card
          v-for="(product, index) in allProducts"
          :key="index"
          class="product-home"
          @click="seeProduct(product)"
          elevation="0"
        >
          <v-img class="product-home-img" :src="product.p_photo" />
          <h5>${{ product.p_price }}</h5>
          <p>{{ product.p_name }}</p>
        </v-card>
      </div>
      <v-btn
        class="fab-home"
        dark
        large
        color="error"
        fixed
        right
        bottom
        @click="homeView = !homeView"
      >
        <v-icon size="15">fas fa-store</v-icon>
        <h6>Tiendas</h6>
      </v-btn>
    </div>
    <div v-else>
      <h3>Tiendas</h3>
      <v-btn
        class="fab-home"
        dark
        large
        color="error"
        fixed
        right
        bottom
        @click="homeView = !homeView"
      >
        <v-icon size="15">fas fa-tshirt</v-icon>
        <h6>Productos</h6>
      </v-btn>
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
          <v-chip class="pa-4" large text-color="secondary" color="primary">
            {{ business.b_name }}
          </v-chip>
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
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Product } from "/firebaseAPI/controllers/product.js";
import { Business } from "/firebaseAPI/controllers/business.js";
import ProductDetails from "@/components/ProductDetails.vue";
import OrderDetails from "@/components/OrderDetails.vue";

export default {
  name: "Home",

  components: {
    ProductDetails,
    OrderDetails,
  },

  data() {
    return {
      homeView: true,
      productDialog: false,
      orderDialog: false,
      date: "",
      update: 0,
      product: {
        id_business: 0,
        id_product: 0,
        p_photo: null,
        p_name: "",
        p_price: 0,
        p_description: "",
        p_category: "",
        p_saved: false,
      },
      business: {
        id_business: "",
        b_name: "",
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
    await this.readProductDocuments();
    this.date = this.getDate();
  },

  methods: {
    ...mapActions(["resetOrder"]),

    async readProductDocuments() {
      const P = new Product();
      await P.readProducts().then(
        (res) => (this.allProducts = P.docsObjectToArray(res))
      );
    },

    async readBusiness(id_business) {
      const B = new Business();
      await B.readBusinessWithID(id_business).then(
        (res) => (this.business = B.docsObjectToArray(res))
      );
    },

    closeDialog() {
      this.productDialog = false;
      this.update++;
    },

    seeProduct(item) {
      this.product = item;
      this.productDialog = true;
      this.readBusiness(item.id_business);
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
  },
};
</script>
