<template>
  <!-- * If cart is empty -->
  <v-card
    v-if="cart.o_products.length < 1"
    class="my-4 rounded-xl"
    align="center"
    elevation="0"
  >
    <v-card class="card-empty-cart" color="secondary" elevation="0">
      <v-icon class="my-8" size="150">fas fa-receipt</v-icon>
      <div class="mx-4">
        <h1>Carrito vacío</h1>
        <p>¿Qué esperas para agregar productos? ;)</p>
      </div>
    </v-card>
  </v-card>

  <!-- * Products in cart -->
  <v-card v-else elevation="0">
    <Dialog
      :d_value="deleteProductDialog"
      :d_title="d_data.d_title"
      :d_message="d_data.d_message"
      :d_cancel="d_data.d_cancel"
      :d_accept="d_data.d_accept"
      :d_color="d_data.d_color"
      :d_icon="d_data.d_icon"
      @dialog-accept="deleteFromCart(selectedProductId)"
      @dialog-cancel="deleteProductDialog = false"
      class="v-dialog"
    />

    <v-dialog
      v-model="uploadingDialog"
      hide-overlay
      persistent
      width="300"
      class="v-dialog"
    >
      <v-card color="lightred" class="pt-4">
        <v-card-text>
          Creando orden
          <v-progress-linear indeterminate color="green"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

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

    <v-container class="order-container">
      <v-card
        v-for="(product, index) in orderedProducts"
        :key="index"
        v-model="orderedProducts"
        elevation="4"
        color="secondary"
        class="card-order"
      >
        <div class="container-img-order">
          <v-img
            class="order-img"
            centered
            contain
            lazy-src="https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/large/public/2021-10/los-mejores-juegos-de-perritos-cachorros-por-mes-de-edad.png?itok=UNEbd6Xh"
            :src="product.p_photo"
          ></v-img>
        </div>

        <div class="container-info-order">
          <h4 class="ma-0 font-weight-bold">
            {{ product.p_name }}
          </h4>

          <p class="ma-0 font-weigth-light">
            {{ product.b_name }}
          </p>

          <h3 class="ma-0 font-weight-bold">
            ${{ parseInt(product.p_price) }}
          </h3>
        </div>

        <div class="container-buttons-order">
          <div class="d-flex quantityContainer">
            <button @click="decrement(product.id_product)">-</button>
            <input type="number" v-model="product.op_quantity" min="1" />
            <button @click="increment(product.id_product)">+</button>
          </div>
          <v-btn
            large
            color="lighterred"
            rounded
            elevation="0"
            class="button-delete-order"
            @click="openDeleteDialog(product.id_product)"
          >
            <v-icon color="error">fas fa-trash</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-container>

    <v-footer class="footer-order" absolute>
      <div class="total-order-container">
        <h4>${{ calcTotal() }}</h4>
        <h6 class="ml-3">MXN</h6>
      </div>
      <div class="button-order-area">
        <v-btn
          class="btn-confirm-order"
          @click="uploadOrder()"
          text-color="secondary"
          color="primary"
        >
          <v-icon size="18">fas fa-cube</v-icon>
          <h6 class="ml-3">Continuar</h6>
        </v-btn>
      </div>
    </v-footer>

    <!-- Receipt -->
    <div class="container hidden" id="receipt">
      <div class="receipt-header">
        <div class="header__info">
          <h1>LittleBusiness</h1>
          <h4>Recibo de entrega</h4>
        </div>

        <div class="header__order-info">
          <p class="mar-0 receipt-font">
            Orden #{{ cart.id_order }} para {{ userName }}
          </p>
          <p class="mar-0 receipt-font">{{ this.getDate() }}</p>
        </div>
      </div>

      <hr />

      <table class="products-table">
        <tr>
          <th class="receipt-font">Cant.</th>
          <th class="receipt-font">Item</th>
          <th class="receipt-font">Precio</th>
        </tr>
        <tr v-for="(prod, index) in orderedProducts" :key="index">
          <td class="receipt-font">{{ prod.op_quantity }}</td>
          <td class="receipt-font">{{ prod.p_name }}</td>
          <td class="receipt-font">
            ${{ parseFloat(prod.p_price).toFixed(2) }}
          </td>
        </tr>
      </table>

      <hr />

      <div class="receipt-resume">
        <div class="receipt__row">
          <p class="receipt-font">Total de Items:</p>
          <p class="receipt-font">{{ orderedProducts.length }}</p>
        </div>
        <div class="receipt__row">
          <p class="receipt-font">Precio total:</p>
          <p class="receipt-font">${{ calcTotal() }}</p>
        </div>
      </div>

      <hr />

      <div class="receipt__row mar-top-10">
        <p class="receipt-font">Atendido por: Business Owner</p>
      </div>

      <div class="receipt-footer">
        <p class="receipt-font">
          Gracias por apoyar mi <b class="receipt-font">Pequeño negocio</b>
        </p>

        <div id="qr"></div>

        <p class="receipt-font">littlebusiness.com</p>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { User } from "/firebaseAPI/controllers/user.js";
import { Order } from "/firebaseAPI/controllers/order.js";
import { Product } from "/firebaseAPI/controllers/product.js";
import { Business } from "/firebaseAPI/controllers/business";
import { getDataOrdersByBusiness } from "../../firebaseAPI/controllers/business";
import html2pdf from "html2pdf.js";
import Dialog from "@/components/Dialog.vue";

export default {
  name: "OrderDetails",

  props: ["products"],

  components: {
    Dialog,
  },

  data: () => {
    return {
      uploadingDialog: false,

      deleteProductDialog: false,
      d_data: {
        d_title: "Eliminar producto",
        d_message:
          "¿Estás seguro que eliminar el producto de esta orden? Esta acción no se puede deshacer.",
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
      },

      allBusinesses: [],
      myBusiness: {},

      allProducts: [],
      orderedProducts: [],
      selectedProductId: "",

      userName: "",

      editable: false,
    };
  },

  mounted() {},

  async created() {
    await this.getUsername();
    await this.getBusinesses();
    await this.getProducts();
    this.getOrderedProducts();
  },

  computed: {
    ...mapState(["cart"]),
  },

  methods: {
    ...mapActions([
      "incrementQuantity",
      "decrementQuantity",
      "deleteProduct",
      "resetOrder",
    ]),

    async getUsername() {
      const user = await User.getLogedUser().then(async (user) => {
        if (user != null) {
          this.userName = user.displayName;
        }
      });
    },

    async getBusinesses() {
      const B = new Business();
      await B.readBusiness().then(
        (res) => (this.allBusinesses = B.docsObjectToArray(res))
      );
    },

    async getProducts() {
      const P = new Product();
      await P.readProducts().then(
        (res) => (this.allProducts = P.docsObjectToArray(res))
      );

      this.allProducts.forEach((product) => {
        for (let i = 0; i < this.allBusinesses.length; i++)
          if (product.id_business == this.allBusinesses[i].id_business) {
            Object.assign(product, { b_name: this.allBusinesses[i].b_name });
            break;
          }
      });
    },

    getOrderedProducts() {
      const PRODUCTS_SIZE = this.allProducts.length;

      this.cart.o_products.forEach((prod) => {
        for (let i = 0; i < PRODUCTS_SIZE; i++) {
          if (prod.id_product == this.allProducts[i].id_product) {
            this.orderedProducts.push(
              Object.assign(this.allProducts[i], {
                op_quantity: prod.op_quantity,
              })
            );
            break;
          }
        }
      });
    },

    increment(id_product) {
      const ORDER_PRODUCTS_SIZE = this.orderedProducts.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++)
        if (id_product == this.orderedProducts[i].id_product)
          this.orderedProducts[i].op_quantity++;

      this.incrementQuantity({ id_product: id_product, op_quantity: 1 });
      this.$forceUpdate();
    },

    decrement(id_product) {
      const ORDER_PRODUCTS_SIZE = this.orderedProducts.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++)
        if (id_product == this.orderedProducts[i].id_product)
          this.orderedProducts[i].op_quantity =
            this.orderedProducts[i].op_quantity > 1
              ? this.orderedProducts[i].op_quantity - 1
              : 1;

      this.decrementQuantity({ id_product: id_product, op_quantity: 1 });
      this.$forceUpdate();
    },

    openDeleteDialog(id_product) {
      this.selectedProductId = id_product;
      this.deleteProductDialog = true;
    },

    deleteFromCart(id_product) {
      const ORDER_PRODUCTS_SIZE = this.orderedProducts.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++)
        if (id_product == this.orderedProducts[i].id_product) {
          this.orderedProducts.splice(i, 1);
          break;
        }

      this.deleteProduct(id_product);
      this.deleteProductDialog = false;

      if (this.cart.o_products.length < 1) {
        this.resetOrder();

        this.snackbarProps.status = false;

        this.snackbarProps.text = "Carrito vaciado";
        this.snackbarProps.timeout = 3000;
        this.snackbarProps.icon = "fas fa-check";
        this.snackbarProps.color = "green";

        this.snackbarProps.status = true;

        this.$emit("close-dialog");
      }
    },

    calcTotal() {
      let sum = 0;
      this.orderedProducts.forEach((prod) => {
        sum += prod.op_quantity * prod.p_price;
      });

      return sum;
    },

    async uploadOrder() {
      const O = new Order();

      this.uploadingDialog = true;

      this.getDate();

      O.addOrder(this.cart)
        .then((res) => {
          this.generateReceipt();

          this.snackbarProps.status = true;
          this.snackbarProps.text = "Orden creada correctamente";
          this.snackbarProps.color = "green";
          this.snackbarProps.icon = "fas fa-check-circle";

          this.uploadingDialog = false;

          this.$emit("close-dialog");
          this.resetOrder();
        })
        .catch((error) => {
          this.snackbarProps.status = true;
          this.snackbarProps.text = "Ha habido un error almacenando la orden";
          this.snackbarProps.color = "error";
          this.snackbarProps.icon = "fas fa-exclamation-circle";

          this.uploadingDialog = false;
        });
    },

    generateQR(data) {
      const QR = require("qrcode");

      QR.toCanvas(data, (err, canvas) => {
        if (err) throw err;

        const QRContainer = document.getElementById("qr");

        QRContainer.innerHTML = "";
        QRContainer.appendChild(canvas);
      });
    },

    generateReceipt() {
      if (this.cart.id_order) this.generateQR(this.cart.id_order);

      const receipt = document.getElementById("receipt");

      receipt.classList.remove("hidden");
      html2pdf(receipt, {
        filename: "order_" + this.cart.id_order,
      });

      this.$nextTick(() => {
        receipt.classList.add("hidden");
      });
    },

    getDate() {
      const today = new Date();
      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      const daysOfWeek = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];

      return `${daysOfWeek[today.getDay()]}, ${
        months[today.getMonth()]
      } ${today.getDate()}, ${today.getFullYear()}`;
    },
  },
};
</script>
