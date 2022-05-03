<template>
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
      <h1>${{ parseFloat(product.p_price).toFixed(2) }} c/u</h1>
      <div class="d-flex ma-4 align-center">
        <!-- Incrementador y botón de ordenar -->
        <div>
          <!-- Incrementador -->
          <button
            style="background-color: var(--bone); width: 80px"
            @click="decrement"
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
            @click="increment"
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
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ProductDetails",

  props: ["product"],

  data: () => {
    return {
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

  methods: {
    ...mapActions(["addOrder", "addProducts"]),

    increment() {
      this.quantity = this.quantity > 0 ? this.quantity + 1 : 1;
    },

    decrement() {
      this.quantity = this.quantity > 0 ? this.quantity - 1 : 1;
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

        // If it gets to this part, it means the product is new.
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

      this.order.id_user = 1;
      this.order.o_datetime = currDate;
      this.order.o_status = "Pending";
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

<style lang="css">
@import "../styles/main.css";
@import "../styles/product.css";
</style>
