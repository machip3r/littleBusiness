<template>
  <div>
    <!-- Cancel Order -->
    <CancelDialog
      :d_value="cancelOrderDialog"
      :d_title="d_data.d_title"
      :d_message="d_data.d_message"
      :d_cancel="d_data.d_cancel"
      :d_accept="d_data.d_accept"
      :d_color="d_data.d_color"
      :d_icon="d_data.d_icon"
      @dialog-accept="updateOrder()"
      @dialog-cancel="cancelOrderDialog = false"
      class="v-dialog"
    />

    <!-- Confirm Changes -->
    <CancelDialog
      :d_value="confirmChangesDialog"
      :d_title="d_data.d_title"
      :d_message="d_data.d_message"
      :d_cancel="d_data.d_cancel"
      :d_accept="d_data.d_accept"
      :d_color="d_data.d_color"
      :d_icon="d_data.d_icon"
      @dialog-accept="closeConfirmDialog()"
      @dialog-cancel="confirmChangesDialog = false"
      class="v-dialog"
    />

    <v-dialog v-model="cancellingDialog" hide-overlay persistent width="300">
      <v-card color="lightred" class="pt-4">
        <v-card-text>
          Cancelando orden
          <v-progress-linear
            indeterminate
            color="lighterred"
          ></v-progress-linear>
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

    <!-- Order Details -->
    <v-dialog
      :key="updateDetails"
      v-model="orderDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="elevation-0">
        <div class="pa-4">
          <v-row align="center">
            <v-col cols="1">
              <v-btn
                @click="closeOrderDialog()"
                fab
                elevation="0"
                color="primary"
              >
                <v-icon color="secondary">fas fa-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="8">
              <v-row>
                <v-col><h1>Mi pedido</h1></v-col>
              </v-row>
              <v-row>
                <v-col
                  ><h3>{{ selectedOrder.f_datetime }}</h3></v-col
                >
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="1">
              <v-chip class="pa-4" large text-color="secondary" color="primary">
                amip ixula
              </v-chip>
            </v-col>
            <v-col cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    elevation="0"
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click="generateReceipt()"
                  >
                    <!-- Falta @click -->
                    <v-icon color="secondary">fas fa-receipt</v-icon>
                  </v-btn>
                </template>
                <span>Imprimir recibo (¿cuál?)</span>
              </v-tooltip>
            </v-col>
            <v-col cols="1" v-if="selectedOrder.o_status === 'p'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    elevation="0"
                    color="lighterred"
                    v-bind="attrs"
                    v-on="on"
                    @click="cancelOrderDialog = true"
                  >
                    <v-icon color="error">fas fa-trash</v-icon>
                  </v-btn>
                </template>
                <span>Cancelar la orden</span>
              </v-tooltip>
            </v-col>
          </v-row>

          <OrderDetails
            :originalOrder="selectedOrder"
            :order="editableOrder"
            @close-dialog="closeConfirmDialog()"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- Header -->
    <v-row class="pt-6 px-6 row-title-home" align="center" justify="center">
      <v-col class="col-title-home">
        <h1>Mis pedidos</h1>
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

      <!-- TODO: Visible para el vendedor solamente -->
      <v-col>
        <v-chip class="pa-4" x-large text-color="secondary" color="primary">
          {{ myBusiness.b_name }}
        </v-chip>
      </v-col>
    </v-row>

    <v-chip-group mandatory active-class="month-select--active" class="ml-6">
      <v-chip
        v-for="filter in orderFilters"
        :key="filter.id"
        @change="filterOrders(filter.filterCode)"
      >
        <h5>{{ filter.text }}</h5>
      </v-chip>
    </v-chip-group>

    <v-card
      v-if="filteredOrders.length < 1"
      class="my-4 rounded-xl"
      align="center"
      elevation="0"
    >
      <v-card width="40%" height="500px" color="secondary" elevation="0">
        <v-icon class="my-8" size="150">fas fa-receipt</v-icon>
        <div class="mx-4">
          <h1>{{ emptyFilter[activeFilter].title }}</h1>
          <p>{{ emptyFilter[activeFilter].message }}</p>
        </div>
      </v-card>
    </v-card>

    <v-row v-else>
      <div class="mx-auto" v-for="order in filteredOrders" :key="order.id">
        <v-card
          class="ma-8 pb-3"
          flat
          width="500"
          elevation="3"
          @click="seeOrderDetails(order)"
        >
          <v-toolbar class="elevation-0 gradient-background">
            <div>
              <v-badge :color="badgeColors[order.o_status]"></v-badge>
            </div>
            <v-spacer></v-spacer>
            <v-toolbar-title
              >#{{ order.id_order.toUpperCase() }}</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-toolbar-title>
              <strong>{{ order.u_name }}</strong>
            </v-toolbar-title>
            <!-- TODO: Mostrar el nombre del usuario que hizo la orden (vista de vendedor) -->
            <v-spacer></v-spacer>
            <v-toolbar-title>
              <v-icon>far fa-calendar</v-icon>
              {{ order.f_datetime }}
            </v-toolbar-title>
          </v-toolbar>

          <v-row class="my-3 px-8">
            <v-col cols="6"><strong>Total</strong></v-col>
            <v-spacer></v-spacer>
            <v-col cols="4">
              <strong>${{ parseFloat(order.o_total).toFixed(2) }} MXN</strong>
            </v-col>
          </v-row>
          <v-card
            class="ma-1"
            color="secondary"
            elevation="0"
            v-for="product in order.o_products"
            :key="product.id"
          >
            <v-row class="px-8">
              <v-col cols="2">
                <strong>{{ product.op_quantity }}x</strong>
              </v-col>
              <v-col cols="6">
                <strong>{{ product.p_name }} </strong>
              </v-col>
              <v-col cols="4">
                <strong>
                  ${{ parseFloat(product.p_price).toFixed(2) }} MXN
                </strong>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </div>
    </v-row>

    <!-- Receipt -->
    <div class="container hidden" id="receipt">
      <div class="receipt-header">
        <div class="header__info">
          <h1>LittleBusiness</h1>
          <h4>Recibo de entrega</h4>
        </div>

        <div class="header__order-info">
          <p class="mar-0 receipt-font">
            Orden #{{ selectedOrder.id_order }} para {{ userName }}
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
        <tr v-for="(prod, index) in selectedOrder.o_products" :key="index">
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
          <p class="receipt-font">{{ selectedOrder.o_products.length }}</p>
        </div>
        <div class="receipt__row">
          <p class="receipt-font">Precio total:</p>
          <p class="receipt-font">${{ selectedOrder.o_total }}</p>
        </div>
      </div>

      <hr />

      <div class="receipt__row mar-top-10">
        <p class="receipt-font">¡Ten un excelente día!</p>
      </div>

      <div class="receipt-footer">
        <p class="receipt-font">
          Gracias por apoyar mi <b class="receipt-font">Pequeño negocio</b>
        </p>

        <div id="qr"></div>

        <p class="receipt-font">littlebusiness.com</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Order } from "/firebaseAPI/controllers/order.js";
import { Product } from "/firebaseAPI/controllers/product.js";
import { Business } from "/firebaseAPI/controllers/business.js";
import html2pdf from "html2pdf.js";
import OrderDetails from "@/components/OrderDetails.vue";
import CancelDialog from "@/components/Dialog.vue";
import { getDataOrdersByBusiness } from "../../../firebaseAPI/controllers/business";

export default {
  name: "Order",

  components: {
    OrderDetails,
    CancelDialog,
  },

  watch: {},

  data: () => {
    return {
      userName: "",

      updateDetails: 0,

      snackbarProps: {
        status: false,
        text: "",
        timeout: 3000,
        icon: "",
      },

      cancelOrderDialog: false,
      confirmChangesDialog: false,
      cancellingDialog: false,
      d_data: {
        d_title: "Cancelar Orden",
        d_message:
          "¿Estás seguro que deseas cancelar esta orden? Esta acción no se puede deshacer.",
        d_cancel: "No, regresar",
        d_accept: "Sí, cancelar",
        d_color: "red",
        d_icon: "fas fa-trash",
      },

      orderDialog: false,

      formattedOrderDate: "",

      allOrders: [],
      activeFilter: "p",
      emptyFilter: {
        a: {
          title: "¡Parece que no hay pedidos actualmente!",
          message: "¿Qué te parece si creamos algunos? ;)",
        },
        p: {
          title: "¡Ya liquidaste todas tus deudas!",
          message: "Qué bien se siente ver este mensaje, ¿no?",
        },
        d: {
          title: "¿Aún no te decides?",
          message:
            "Tranquilo, tómate tu tiempo. Nadie va a morir por esto, ¿verdad?",
        },
        c: {
          title: "¡Así nos gusta, sin deudas!",
          message:
            "Asegúrate de cumplir con todos tus pedidos para que siguas viendo este mensaje. ;)",
        },
      },
      orderFilters: [
        {
          text: "Todas",
          filterCode: "a",
        },
        {
          text: "Pendientes",
          filterCode: "p",
        },
        {
          text: "Completadas",
          filterCode: "d",
        },
        {
          text: "Canceladas",
          filterCode: "c",
        },
      ],
      filteredOrders: [],
      selectedOrder: {
        f_datetime: "",
        firebaseID: "",
        id_order: "",
        id_user: "",
        o_datetime: "",
        o_products: "",
        o_status: "",
        o_total: 0,
      },
      editableOrder: {},

      allProducts: [],

      allBusinesses: [],
      myBusiness: {},
      myBusinessOrders: {},

      badgeColors: {
        d: "#2D3440",
        p: "green",
        c: "red",
      },
    };
  },

  computed: {
    ...mapState(["user"]),
  },

  async created() {
    await this.getBusinesses();
    await this.getProducts();
    await this.getOrders();

    console.log(this.user);

    for (let i = 0; i < this.allBusinesses.length; i++)
      if (this.allBusinesses[i].id_user == this.user.uid) {
        Object.assign(this.myBusiness, this.allBusinesses[i]);
        break;
      }

    // Optimizar
    getDataOrdersByBusiness(this.myBusiness.id_business).then((res) => {
      let id_orders = [];
      res.forEach((product) => {
        id_orders.push(product.id_order);
      });

      id_orders = Array.from(new Set([...id_orders]));
      this.filteredOrders = [];

      id_orders.forEach((id) => {
        let sum = 0;
        let tempOrder = {
          id_order: id,
          id_user: 0,
          o_datetime: "",
          o_products: [],
          o_status: "p",
        };

        res.forEach((product) => {
          if (product.id_order == id) {
            tempOrder.id_user = product.id_user;
            tempOrder.o_datetime = product.o_datetime;
            tempOrder.o_status = "p";

            sum += product.p_price * product.op_quantity;

            tempOrder.f_datetime = this.formatDate(product.o_datetime);

            delete product.id_order;
            delete product.id_user;
            delete product.date;
            delete product.o_datetime;
            delete product.o_status;

            tempOrder.o_products.push(product);
          }
        });
        tempOrder.o_total = sum;

        this.filteredOrders.push(tempOrder);
      });
    });
  },

  mounted() {},

  methods: {
    // TODO: Actualizar para que se obtenga el id del negocio desde la ruta
    async getBusinesses() {
      const B = new Business();
      await B.readBusiness().then((res) => {
        this.allBusinesses = B.docsObjectToArray(res);
      });
    },

    async getProducts() {
      const P = new Product();
      await P.readProducts().then(
        (res) => (this.allProducts = P.docsObjectToArray(res))
      );
    },

    async getOrders() {
      const O = new Order();
      await O.readOrders().then((res) => {
        this.allOrders = O.docsObjectToArray(res);

        this.allOrders.forEach((order) => {
          let o_total = 0;
          order.f_datetime = this.formatDate(order.o_datetime);

          order.o_products.forEach((orderedProduct) => {
            for (let i = 0; i < this.allProducts.length; i++) {
              if (
                orderedProduct.id_product === this.allProducts[i].id_product
              ) {
                delete orderedProduct.id_product;
                o_total +=
                  parseInt(this.allProducts[i].p_price) *
                  parseInt(orderedProduct.op_quantity);
                Object.assign(orderedProduct, this.allProducts[i]);
                break;
              }
            }

            for (let i = 0; i < this.allBusinesses.length; i++) {
              if (
                parseInt(orderedProduct.id_business) ==
                this.allBusinesses[i].id_business
              ) {
                Object.assign(orderedProduct, {
                  id_business: this.allBusinesses[i].id_business,
                  b_name: this.allBusinesses[i].b_name,
                });
                break;
              }
            }
          });
          order.o_total = o_total;
        });

        this.allOrders.forEach((product) => {
          for (let i = 0; i < this.allBusinesses.length; i++) {
            if (product.id_business == this.myBusiness.id_business) {
              this.filteredOrders.push(this);
            }
          }
        });
      });
    },

    async updateOrder() {
      const O = new Order();

      this.cancellingDialog = true;

      let tempOrder = JSON.parse(JSON.stringify(this.selectedOrder)),
        cloneOrder = JSON.parse(JSON.stringify(this.selectedOrder));

      tempOrder.o_products = JSON.parse(
        JSON.stringify(this.selectedOrder.o_products)
      );
      cloneOrder.o_products = JSON.parse(
        JSON.stringify(this.selectedOrder.o_products)
      );

      delete tempOrder.firebaseID;
      delete tempOrder.f_datetime;
      delete tempOrder.o_total;

      tempOrder.o_products.forEach((product) => {
        delete product.firebaseID;
        delete product.id_business;
        delete product.p_category;
        delete product.p_description;
        delete product.p_name;
        delete product.p_photo;
        delete product.p_price;
        delete product.b_name;
      });

      tempOrder.o_status = "c";

      O.updateOrder(this.selectedOrder.firebaseID, tempOrder)
        .then((res) => {
          this.cancelOrderDialog = false;
          this.cancellingDialog = true;
          this.orderDialog = false;

          for (let i = 0; i < this.allOrders.length; i++)
            if (this.allOrders[i].id_order === tempOrder.id_order) {
              Object.keys(tempOrder).forEach((key) => {
                if (key !== "o_products") cloneOrder[key] = tempOrder[key];
              });
              this.allOrders[i] = cloneOrder;
              this.selectedOrder = this.allOrders[i];

              break;
            }

          this.filterOrders(this.activeFilter);

          this.snackbarProps.status = true;
          this.snackbarProps.text = `Orden #${this.selectedOrder.id_order} cancelada`;
          this.snackbarProps.color = this.selectedOrder.o_status;
          this.snackbarProps.icon = "fas fa-check-circle";

          this.cancellingDialog = false;
        })
        .catch((err) => {
          this.cancelOrderDialog = false;
          this.snackbarProps.status = true;
          this.snackbarProps.text = `¡Hubo un error al cancelar la orden!`;
          this.snackbarProps.color = "red";
          this.snackbarProps.icon = "exclamation-circle";

          this.cancellingDialog = false;
        });
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

    seeOrderDetails(order) {
      this.updateDetails++;
      this.selectedOrder = order;

      this.editableOrder = JSON.parse(JSON.stringify(order));
      this.editableOrder.o_products = JSON.parse(
        JSON.stringify(order.o_products)
      );

      this.orderDialog = true;
    },

    closeOrderDialog() {
      this.confirmChangesDialog = false;
      this.d_data.d_title = "Confirmar cambios";
      this.d_data.d_message =
        "Tiene cambios sin realizar, ¿está seguro que desea regresar?";
      this.d_data.d_cancel = "Continuar editando";
      this.d_data.d_accept = "Descartar cambios";
      this.d_data.d_color = "red";
      this.d_data.d_icon = "fas fa-trash";

      if (
        this.selectedOrder.o_products.length ===
        this.editableOrder.o_products.length
      ) {
        for (let i = 0; i < this.selectedOrder.o_products.length; i++) {
          if (
            this.selectedOrder.o_products[i].op_quantity !==
            this.editableOrder.o_products[i].op_quantity
          ) {
            this.confirmChangesDialog = true;

            return;
          }
        }
      } else {
        this.confirmChangesDialog = true;
        return;
      }

      this.closeConfirmDialog();
    },

    closeConfirmDialog() {
      this.confirmChangesDialog = false;
      this.orderDialog = false;

      this.editableOrder = JSON.parse(JSON.stringify(this.selectedOrder));
      this.editableOrder.o_products = JSON.parse(
        JSON.stringify(this.selectedOrder.o_products)
      );
    },

    filterOrders(filter) {
      this.activeFilter = filter;
      if (filter === "a") this.filteredOrders = [...this.allOrders];
      else {
        this.filteredOrders = [];
        this.allOrders.forEach((order) => {
          if (order.o_status == filter) this.filteredOrders.push(order);
        });
      }
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
      this.generateQR(this.selectedOrder.id_order);

      const receipt = document.getElementById("receipt");

      receipt.classList.remove("hidden");
      html2pdf(receipt, {
        filename: "order_" + this.selectedOrder.id_order,
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

<style></style>
