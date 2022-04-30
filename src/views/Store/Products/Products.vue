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
            <v-btn class="mx-2" fab dark large color="lightblue" elevation="0">
              <v-icon color="darkblue">fas fa-store</v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="order.o_products.length > 0">
            <v-badge
              color="lightred"
              overlap
              :content="order.o_products.length"
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
                <button
                  style="background-color: var(--bone); width: 80px"
                  @click="decrementar"
                >
                  -
                </button>
                <input
                  style="background-color: var(--bone)"
                  type="number"
                  v-model="quantity"
                />
                <button
                  style="background-color: var(--bone); width: 80px"
                  @click="incrementar"
                >
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
        <v-card elevation="0" v-if="this.o_products.length < 1">
          <h1>Carrito vacío</h1>
        </v-card>
        <v-row v-else>
          <v-col v-for="(product, index) in this.o_products" :key="index">
            <v-card
              width="400"
              class="ml-4 pa-5 mb-5 rounded-xl fill-height"
              v-model="order.o_products"
              elevation="4"
              color="bone"
            >
              <v-row>
                <v-col>
                  <v-img
                    max-width="90"
                    max-height="90"
                    centered
                    contain
                    lazy-src="https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/large/public/2021-10/los-mejores-juegos-de-perritos-cachorros-por-mes-de-edad.png?itok=UNEbd6Xh"
                    :src="product.p_photo"
                  ></v-img
                ></v-col>
                <v-col class="text-left">
                  <v-row>
                    <v-col justify-content="start">
                      <p class="ma-0 font-weight-bold">{{ product.p_name }}</p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <p class="ma-0 font-weight-light">Business Name</p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <p class="ma-0 font-weight-bold">
                        ${{ parseFloat(product.p_price).toFixed(2) }} MXN
                      </p>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col align-self="center">
                  <v-row>
                    <v-col>
                      <div class="d-flex quantityContainer">
                        <button @click="decrementar">-</button>
                        <input
                          type="number"
                          v-model="product.op_quantity"
                          min="1"
                        />
                        <button @click="incrementar">+</button>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn
                        large
                        color="lighter_red"
                        width="99px"
                        height="33px"
                        rounded
                        elevation="0"
                      >
                        <v-icon color="lightred">fas fa-trash</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
            <!-- 
            <v-card
              width="380"
              class="ml-4 mb-5 rounded-xl fill-height"
              v-model="order.o_products"
              elevation="4"
              color="bone"
            >
              <div class="d-flex justify-center pa-4">
                <v-img
                  max-width="90"
                  max-height="90"
                  centered
                  contain
                  lazy-src="https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/large/public/2021-10/los-mejores-juegos-de-perritos-cachorros-por-mes-de-edad.png?itok=UNEbd6Xh"
                  :src="product.p_photo"
                ></v-img>
                <div class="mx-4 d-flex flex-column text-left">
                  <p class="font-weight-bold">{{ product.p_name }}</p>
                  <p class="font-weight-light">Business Name</p>
                  <p class="font-weight-bold">
                    ${{ parseFloat(product.p_price).toFixed(2) }} MXN
                  </p>
                </div>
                <div class="d-flex flex-column align-space-between">
                  <div class="d-flex quantityContainer">
                    <button @click="decrementar">-</button>
                    <input type="number" v-model="quantity" min="1" />
                    <button @click="incrementar">+</button>
                  </div>
                  <v-btn
                    large
                    color="lighter_red"
                    width="100px"
                    height="33px"
                    rounded
                    elevation="0"
                  >
                    <v-icon color="lightred">fas fa-trash</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-card> -->
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { Product } from "/firebaseAPI/controllers/product.js";
import { Order } from "/firebaseAPI/controllers/order.js";
import ProductDetails from "../../../components/ProductDetails.vue";

export default {
  name: "Products",

  components: {
    ProductDetails,
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
      quantity: 1, // Pass to state's cart
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
  },

  methods: {
    ...mapActions(["addOrder", "addProductsToOrder"]),

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

    incrementar() {
      this.quantity++;
    },

    decrementar() {
      this.quantity = this.quantity > 1 ? this.quantity - 1 : 1;
    },

    // Maybe I'll change it so it only uses state's mutations.
    addToCart(id_product) {
      const PRODUCTS_SIZE = this.allProducts.length;

      console.log("Verify if exists in products");
      for (let i = 0; i < PRODUCTS_SIZE; i++) {
        if (id_product == this.allProducts[i].id_product) {
          console.log("It exists");

          const ORDER_PRODUCTS_SIZE = this.o_products.length;

          if (ORDER_PRODUCTS_SIZE > 0) {
            console.log("Cart not empty");

            console.log("Verify if it is already in the cart");
            for (let j = 0; j < ORDER_PRODUCTS_SIZE; j++) {
              if (id_product == this.o_products[j].id_product) {
                console.log("Existing product in cart, adding quantity.");
                this.o_products[j].op_quantity += this.quantity;

                this.quantity = 1;
                this.productDialog = false;

                return;
              }
            }

            console.log("Product non existing in cart. Adding it");
            this.o_products.push(
              Object.assign({ op_quantity: this.quantity }, this.allProducts[i])
            );

            this.quantity = 1;
            this.productDialog = false;

            return;
          } else {
            console.log("Empty cart. Adding new product.");

            this.o_products.push(
              Object.assign({ op_quantity: this.quantity }, this.allProducts[i])
            );

            this.quantity = 1;
            this.productDialog = false;

            return;
          }
        } else {
        }
      }
    },

    // Same here, change so it uses only state's mutation.
    uploadToCart() {
      const O = new Order();

      // Get current date and time
      const today = new Date();
      const currDate = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

      // Do something about uploading it to firebase.
      this.order.id_order = O.randID();
      this.order.id_user = 1;
      this.order.o_datetime = currDate;
      this.order.o_status = "Pending";

      this.order.o_products = this.o_products;

      this.addOrder(this.order);
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
  },
};
</script>

<style lang="css">
@import "../../../styles/main.css";
@import "../../../styles/product.css";
</style>
