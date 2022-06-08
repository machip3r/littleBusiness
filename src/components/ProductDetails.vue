<template>
  <div class="container-product-details">
    <img
      class="product-img"
      lazy-src="https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/large/public/2021-10/los-mejores-juegos-de-perritos-cachorros-por-mes-de-edad.png?itok=UNEbd6Xh"
      :src="product.p_photo"
    />
    <div class="container-product-info text-justify">
      <div class="category-text-container">
        <v-icon class="icon-category">{{ product.p_category.c_icon }}</v-icon>
        <h6 class="category-text">{{ product.p_category.c_name }}</h6>
      </div>
      <h1>{{ product.p_name }}</h1>
      <h4>Descripción</h4>
      <p>
        {{ product.p_description }}
      </p>
      <h1>${{ parseFloat(product.p_price).toFixed(2) }} c/u</h1>
    </div>
    <v-footer class="footer-product" absolute color="#fff">
      <div class="product-button-area">
        <div class="container-add-cart-inputs">
          <button @click="decrement" class="button-decrement">
            <v-icon class="icon-decrement">fas fa-minus</v-icon>
          </button>
          <input type="number" v-model="quantity" class="input-add-cart" />
          <button @click="increment" class="button-increment">
            <v-icon class="icon-increment">fas fa-plus</v-icon>
          </button>
        </div>

        <v-btn
          class="button btn-add-cart"
          @click="addToCart(product.id_product)"
        >
          <v-icon class="icon-add-cart">fas fa-rocket</v-icon>
          <h5>Comprar</h5>
        </v-btn>
      </div>
    </v-footer>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getAuth } from "firebase/auth";
import { Category } from "/firebaseAPI/controllers/cateogory.js";

export default {
  name: "ProductDetails",

  props: ["product"],

  data: () => {
    return {
      allCategories: [],

      quantity: 1,
      productDialog: false,
      order: {
        id_order: "",
        id_user: 0,
        o_products: [],
        o_datetime: "",
        o_status: "",
      },
    };
  },

  computed: {
    ...mapState(["cart"]),
  },

  async created() {
    this.getCategories();
  },

  methods: {
    ...mapActions(["addOrder", "addProducts", "incrementQuantity"]),

    async getCategories() {
      const C = new Category();
      await C.readCategories().then((res) => {
        this.allCategories = C.docsObjectToArray(res);
        for (let i = 0; i < this.allCategories.length; i++)
          if (this.product.p_category == this.allCategories[i].id_category) {
            this.product.p_category = this.allCategories[i];
            break;
          }
      });
    },

    increment() {
      this.quantity++;
    },

    decrement() {
      this.quantity = this.quantity - 1 < 1 ? 1 : this.quantity - 1;
    },

    addToCart(id_product) {
      const ORDER_PRODUCTS_SIZE = this.cart.o_products.length;
      const product = { id_product: id_product, op_quantity: this.quantity };

      if (ORDER_PRODUCTS_SIZE > 0) {
        for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++) {
          if (id_product == this.cart.o_products[i].id_product) {
            this.incrementQuantity(product);

            this.quantity = 1;
            this.$emit("close-dialog");

            return;
          }
        }

        this.addProducts(product);

        this.quantity = 1;
        this.$emit("close-dialog");

        return;
      } else {
        this.createOrder(product);

        this.quantity = 1;
        this.$emit("close-dialog");

        return;
      }
    },

    createOrder(product) {
      const currDate = this.getDateTime();

      this.order.id_user = getAuth().currentUser.uid;
      this.order.o_datetime = currDate;
      this.order.o_status = "p";
      this.order.o_products.push(product);

      this.addOrder(this.order);
    },

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
