<!-- TODO-1: Formatear fecha para el diálogo de detalles de producto -->
<template>
  <div>
    <Dialog
      :d_value="resetCartDialog"
      :d_title="d_data.d_title"
      :d_message="d_data.d_message"
      :d_cancel="d_data.d_cancel"
      :d_accept="d_data.d_accept"
      :d_color="d_data.d_color"
      :d_icon="d_data.d_icon"
      @dialog-accept="resetCart()"
      @dialog-cancel="resetCartDialog = false"
      class="v-dialog"
    />

    <v-snackbar
      class="font-weight-bold"
      :color="snackbarProps.color"
      rounded="pill"
      v-model="snackbarProps.status"
      :timeout="snackbarProps.timeout"
    >
      <v-icon class="mr-6">{{ snackbarProps.icon }}</v-icon>
      <strong>
        {{ snackbarProps.text }}
      </strong>
    </v-snackbar>

    <!-- * Product Details Dialog -->
    <v-dialog
      v-model="productDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card elevation="0">
        <div class="pa-4">
          <v-row align="center">
            <v-col cols="10">
              <v-btn
                @click="productDialog = false"
                fab
                elevation="0"
                color="primary"
              >
                <v-icon color="secondary">fas fa-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-chip
                class="pa-4"
                x-large
                text-color="secondary"
                color="primary"
                >{{ product.b_name }}</v-chip
              >
            </v-col>
          </v-row>
        </div>

        <ProductDetails
          @close-dialog="closeDialog()"
          :product="product"
          :key="updateProductDialog"
        />
      </v-card>
    </v-dialog>

    <!-- * Cart Dialog -->
    <v-dialog
      v-model="cartDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card elevation="0">
        <div class="pa-4">
          <v-row align="center">
            <v-col cols="1" class="ma-0">
              <v-btn
                @click="cartDialog = false"
                fab
                elevation="0"
                color="primary"
              >
                <v-icon color="secondary">fas fa-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10" class="ma-0">
              <v-row>
                <v-col> <h1>Carrito de compras</h1> </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <!-- TODO: Place formated date -->
                  <h3 class="font-weight-light">{{ date }}</h3>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="1" v-if="cart.o_products.length > 0">
              <v-btn
                fab
                elevation="0"
                color="lighterred"
                @click="resetCartDialog = true"
              >
                <v-icon color="error">fas fa-trash</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <Cart :key="update" @close-dialog="closeDialog()" />
      </v-card>
    </v-dialog>

    <v-row
      class="pt-6 px-6 row-title-home"
      align="center"
      justify="center"
      fixed
    >
      <v-col class="col-title-home" cols="7">
        <h1>Descubre</h1>
      </v-col>
      <v-col cols="4">
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
      <v-col cols="1">
        <v-badge
          v-if="cart.o_products.length > 0"
          color="red"
          :content="cart.o_products.length"
          overlap
        >
          <v-btn fab elevation="0" color="primary" @click="cartDialog = true">
            <v-icon color="secondary">fas fa-shopping-cart</v-icon>
          </v-btn>
        </v-badge>
        <v-btn
          v-else
          fab
          elevation="0"
          color="primary"
          @click="cartDialog = true"
        >
          <v-icon color="secondary">fas fa-shopping-cart</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="homeView">
      <div class="d-flex mb-4 px-6">
        <h3>Categorías</h3>
      </div>

      <!-- * Product categories -->
      <v-slide-group mandatory class="px-6">
        <v-slide-item v-slot="{ active }">
          <v-btn
            class="gradient-background button-filter-home"
            elevation="0"
            rounded
            active-class="button-filter-home--active"
            :input-value="active"
            @click="filterProducts(0)"
          >
            <div class="flex-column">
              <v-icon class="button-filter-icon-home"> fas fa-globe </v-icon>
              <h5 class="button-filter-text-home">Todos</h5>
            </div>
          </v-btn>
        </v-slide-item>
        <v-slide-item
          v-for="(category, index) in allCategories"
          :key="index"
          v-slot="{ active }"
        >
          <v-btn
            class="gradient-background button-filter-home"
            elevation="0"
            rounded
            active-class="button-filter-home--active"
            :input-value="active"
            @click="filterProducts(category.id_category)"
          >
            <div class="flex-column">
              <v-icon class="button-filter-icon-home">
                {{ category.c_icon }}
              </v-icon>
              <h5 class="button-filter-text-home">
                {{ category.c_name }}
              </h5>
            </div>
          </v-btn>
        </v-slide-item>
      </v-slide-group>

      <!-- * Product skeleton -->
      <div
        class="products-container"
        v-if="filteredProducts.length < 1 && allProducts.length < 1"
      >
        <v-card
          class="product-home"
          elevation="0"
          v-for="num in Array(8)"
          :key="num"
        >
          <v-row>
            <v-col>
              <v-skeleton-loader type="card-avatar"></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- * No products -->

      <v-card
        v-if="filteredProducts.length < 1 && allProducts.length > 1"
        class="my-4 rounded-xl"
        align="center"
        elevation="0"
      >
        <v-card width="40%" height="500px" color="secondary" elevation="0">
          <v-icon class="my-8" size="150">fas fa-filter</v-icon>
          <div class="mx-4">
            <h1>No existe</h1>
            <p>
              Parece que nadie ha decidido vender en esta categoría, ¿por qué no
              aprovechar?
            </p>
          </div>
        </v-card>
      </v-card>

      <!-- * Product container -->
      <div class="products-container">
        <v-card
          v-for="product in filteredProducts"
          v-model="filteredProducts"
          :key="product.id"
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
      <h3>hover</h3>
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
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Product } from "/firebaseAPI/controllers/product.js";
import { Business } from "/firebaseAPI/controllers/business.js";
import { Category } from "/firebaseAPI/controllers/category.js";
import ProductDetails from "@/components/ProductDetails.vue";
import Cart from "@/components/Cart.vue";
import Dialog from "@/components/Dialog.vue";

export default {
  name: "Home",

  components: {
    ProductDetails,
    Cart,
    Dialog,
  },

  data() {
    return {
      resetCartDialog: false,
      d_data: {
        d_title: "Eliminar carrito",
        d_message:
          "¿Estás seguro que deseas eliminar los productos del carrito? Esta acción no se puede deshacer.",
        d_cancel: "No, regresar",
        d_accept: "Sí, eliminar",
        d_color: "red",
        d_icon: "fas fa-trash",
      },

      snackbarProps: {
        status: false,
        text: "",
        timeout: 3000,
        icon: "",
        color: "",
      },

      homeView: true,

      productDialog: false,
      updateProductDialog: 0,

      cartDialog: false,

      date: "",

      update: 0,

      allProducts: [],
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

      activeFilter: 0,
      filteredProducts: [],

      allBusinesses: [],
      business: {
        id_business: "",
        b_name: "",
      },

      allCategories: [],
    };
  },

  computed: {
    ...mapState(["cart"]),
  },

  async created() {
    await this.getCategories();
    await this.getBusinesses();
    await this.getProducts();
    this.date = this.getDate();

    this.filteredProducts = [...this.allProducts];
  },

  methods: {
    ...mapActions(["resetOrder"]),

    resetCart() {
      this.snackbarProps.text = "Carrito vaciado";
      this.snackbarProps.timeout = 3000;
      this.snackbarProps.icon = "fas fa-check";
      this.snackbarProps.color = "green";

      this.resetOrder();

      this.resetCartDialog = false;
      this.snackbarProps.status = true;
      this.cartDialog = false;
    },

    async getCategories() {
      const C = new Category();
      await C.readCategories().then(
        (res) => (this.allCategories = C.docsObjectToArray(res))
      );
    },

    async getBusinesses() {
      const B = new Business();
      await B.readBusiness().then(
        (res) => (this.allBusinesses = B.docsObjectToArray(res))
      );
    },

    async getProducts() {
      const P = new Product();
      await P.readProducts().then((res) => {
        this.allProducts = P.docsObjectToArray(res);
        this.allProducts.forEach((product) => {
          for (let i = 0; i < this.allBusinesses.length; i++)
            if (product.id_business == this.allBusinesses[i].id_business) {
              Object.assign(product, { b_name: this.allBusinesses[i].b_name });
              break;
            }
        });
      });
    },

    closeDialog() {
      this.productDialog = false;
      this.cartDialog = false;
      this.update++;
    },

    seeProduct(item) {
      this.product = item;
      this.productDialog = true;
      this.updateProductDialog++;
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

    filterProducts(filter) {
      this.activeFilter = filter;
      if (filter == 0) this.filteredProducts = [...this.allProducts];
      else {
        this.filteredProducts = [];
        this.allProducts.forEach((producto) => {
          if (producto.p_category == filter) {
            this.filteredProducts.push(producto);
          }
        });
      }
    },
  },
};
</script>
