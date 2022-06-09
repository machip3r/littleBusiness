<template>
  <div>
    <div class="container-dashboard">
      <v-row class="mt-1 ml-1">
        <v-btn
          class="fab-back-business"
          dark
          color="primary"
          fab
          small
          left
          top
          @click="goBackToProfile()"
        >
          <v-icon class="icon-back-business" size="15"
            >fas fa-arrow-left</v-icon
          >
        </v-btn>
        <h1 class="ml-5">Productos</h1>
      </v-row>
    </div>

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
              <div class="info-category-button flex-column">
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
              <div class="info-category-button flex-column">
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
          v-if="filteredProducts.length < 1"
          class="my-4 rounded-xl"
          align="center"
          elevation="0"
        >
          <v-card width="40%" height="500px" color="secondary" elevation="0">
            <v-icon class="my-8" size="150">fas fa-filter</v-icon>
            <div class="mx-4">
              <h1>No existe</h1>
              <p>
                Parece que nadie ha decidido vender en esta categoría, ¿por qué
                no aprovechar?
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Product } from "/firebaseAPI/controllers/product.js";
import { Business } from "/firebaseAPI/controllers/business.js";
import { Category } from "/firebaseAPI/controllers/category.js";
import { Review } from "/firebaseAPI/controllers/review.js";
import ProductDetails from "@/components/ProductDetails.vue";
import Cart from "@/components/Cart.vue";
import Dialog from "@/components/Dialog.vue";

export default {
  name: "ProductsClient",

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

      allBusiness: [],
      allReviews: [],
      businessPhotos: new Map(),
      businessReviews: new Map(),
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
      let businessProducts = [];
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
      for (let i = 0; i < this.allProducts.length; i++) {
        if (this.allProducts[i].id_business == this.$route.params.id) {
          businessProducts.push(
            Object.assign(this.allProducts[i], {
              p_category: this.allProducts[i].p_category,
              p_description: this.allProducts[i].p_description,
              p_name: this.allProducts[i].p_name,
              p_photo: this.allProducts[i].p_photo,
              p_price: this.allProducts[i].p_price,
              p_status: this.allProducts[i].p_status,
            })
          );
        }
      }
      this.allProducts = businessProducts;
    },

    async readBusinessDocuments() {
      this.homeView = !this.homeView;
      if (this.allBusiness.length === 0) {
        const B = new Business();
        const R = new Review();
        await B.readBusiness().then((res) => {
          this.allBusiness = B.docsObjectToArray(res);
        });
        await R.readReviews().then((res) => {
          this.allReviews = R.docsObjectToArray(res);
        });
        this.getBusinessProducts();
        this.setBusinessImage();

        this.getBusinessReviews();
        this.setBusinessReview();
      }
    },

    getBusinessProducts() {
      let productsInBusiness = new Map();
      this.allProducts.forEach((product) => {
        if (productsInBusiness.has(+product.id_business)) {
          let tmp = productsInBusiness.get(+product.id_business);
          tmp.photos.push(product.p_photo);

          if (+product.p_price < tmp.minPrice) tmp.minPrice = +product.p_price;
          else if (+product.p_price > tmp.maxPrice)
            tmp.maxPrice = +product.p_price;

          productsInBusiness.set(+product.id_business, tmp);
        } else {
          productsInBusiness.set(+product.id_business, {
            photos: [product.p_photo],
            minPrice: product.p_price,
            maxPrice: product.p_price,
          });
        }
      });

      productsInBusiness.forEach((business, key) => {
        this.businessPhotos.set(key, {
          photo: this.getRandomProductImage(business.photos),
          minPrice: business.minPrice,
          maxPrice: business.maxPrice,
        });
      });
    },

    getRandomProductImage(businessProducts) {
      return businessProducts[
        Math.floor(Math.random() * businessProducts.length)
      ];
    },

    setBusinessImage() {
      for (let i = 0; i < this.allBusiness.length; i++) {
        let idBusiness = this.allBusiness[i].id_business;
        if (this.businessPhotos.has(idBusiness)) {
          this.$set(
            this.allBusiness[i],
            "photo",
            this.businessPhotos.get(idBusiness).photo
          );
          this.$set(
            this.allBusiness[i],
            "minPrice",
            this.businessPhotos.get(idBusiness).minPrice
          );
          this.$set(
            this.allBusiness[i],
            "maxPrice",
            this.businessPhotos.get(idBusiness).maxPrice
          );
        } else {
          this.$set(
            this.allBusiness[i],
            "photo",
            "https://cdn.vuetifyjs.com/images/cards/cooking.png"
          );
        }
      }
    },

    getBusinessReviews() {
      this.allReviews.forEach((review) => {
        if (this.businessReviews.has(+review.id_business)) {
          let tmp = this.businessReviews.get(+review.id_business);
          tmp.rating += review.r_rate;
          tmp.reviews++;
          this.businessReviews.set(+review.id_business, tmp);
        } else {
          this.businessReviews.set(+review.id_business, {
            rating: +review.r_rate,
            reviews: 1,
          });
        }
      });
    },

    setBusinessReview() {
      for (let i = 0; i < this.allBusiness.length; i++) {
        let idBusiness = this.allBusiness[i].id_business;
        if (this.businessReviews.has(idBusiness)) {
          const reviews = this.businessReviews.get(idBusiness);
          const rating = reviews.rating / reviews.reviews;

          this.$set(this.allBusiness[i], "rating", rating);
        } else {
          this.$set(this.allBusiness[i], "rating", null);
        }
      }
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

    seeBusiness(id) {
      this.$router.push({ name: "Information", params: { id: id } });
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
    truncateText(text, length) {
      if (text.length <= length) {
        return text;
      }
      return text.slice(0, length) + "...";
    },
    async goBackToProfile() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>
