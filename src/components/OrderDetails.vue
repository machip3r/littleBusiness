<template>
  <v-card
    class="d-flex justify-center align-center"
    elevation="0"
    v-if="cart.o_products.length < 1"
  >
    <v-card
      class="d-flex flex-column justify-center align-center rounded-xl"
      width="40%"
      height="500px"
      color="bone"
      elevation="0"
    >
      <v-icon class="my-4" size="100">fas fa-receipt</v-icon>
      <h1>Sin pedidos</h1>
      <p>Revisa los productos y agrega unos cuantos ;)</p>
    </v-card>
  </v-card>
  <v-card v-else elevation="0">
    <v-row>
      <v-col
        v-for="(product, index) in orderedProducts"
        :key="index"
        v-model="orderedProducts"
      >
        <v-card
          width="400"
          class="ml-4 pa-5 mb-5 rounded-xl fill-height"
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
              ></v-img>
            </v-col>
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
                    <button @click="decrement(product.id_product)">-</button>
                    <input
                      type="number"
                      v-model="product.op_quantity"
                      min="1"
                    />
                    <button @click="increment(product.id_product)">+</button>
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
                    @click="deleteFromCart(product.id_product)"
                  >
                    <v-icon color="lightred">fas fa-trash</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div style="background-color: var(--bone); margin-top: 50px">
      <v-row color="bone">
        <v-col>
          <p>Total</p>
          <h1>${{ calcTotal() }} MXN</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="my-auto">
          <v-row class="mb-2">
            <v-btn color="lightblue" large>
              <v-icon left color="darkblue">fas fa-pencil-alt</v-icon>
              Editar orden
            </v-btn>
          </v-row>
          <v-row class="mt-2">
            <v-btn color="success" large @click="uploadOrder()">
              <v-icon left>fas fa-check</v-icon>
              Generar recibo
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- Receipt -->
    <div class="container hidden" id="receipt">
      <div class="receipt-header">
        <div class="header__info">
          <h1>LittleBusiness</h1>
          <h4>Recibo de entrega</h4>
        </div>

        <div class="header__order-info">
          <p class="mar-0 receipt-font">
            Orden #{{ cart.id_order }} para User's Name
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
import { Product } from "/firebaseAPI/controllers/product.js";
import { Order } from "/firebaseAPI/controllers/order.js";
import html2pdf from "html2pdf.js";

export default {
  name: "OrderDetails",

  props: ["products"],

  components: {},

  data: () => {
    return {
      allProducts: [],
      orderedProducts: [],
    };
  },

  async created() {
    await this.readDocuments();
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

    async readDocuments() {
      const P = new Product();
      await P.readProducts().then(
        (res) => (this.allProducts = P.docsObjectToArray(res))
      );
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
            console.log(this.orderedProducts);
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

    deleteFromCart(id_product) {
      const ORDER_PRODUCTS_SIZE = this.orderedProducts.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++)
        if (id_product == this.orderedProducts[i].id_product) {
          this.orderedProducts.splice(i, 1);
          break;
        }

      this.deleteProduct(id_product);
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

      this.getDate();

      O.addOrder(this.cart)
        .then((res) => {
          this.generateReceipt();
        })
        .catch((error) => {
          console.log(error);
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
      this.generateQR(this.cart.id_order);

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

<style lang="css">
@import "../styles/main.css";
@import "../styles/product.css";
@import "../styles/receipt.css";
</style>
