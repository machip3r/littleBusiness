<!-- TODO-4: (Tal vez) hacer que todas las comparaciones de órdenes se basen en el total de la orden para que sea menor carga de computación -->
<template>
  <v-card elevation="0" :disabled="disableInteraction">
    <DeleteProductDialog
      :d_value="deleteProductDialog"
      :d_title="d_data.d_title"
      :d_message="d_data.d_message"
      :d_cancel="d_data.d_cancel"
      :d_accept="d_data.d_accept"
      :d_color="d_data.d_color"
      :d_icon="d_data.d_icon"
      @dialog-accept="deleteFromOrder(selectedProductId)"
      @dialog-cancel="deleteProductDialog = false"
      class="v-dialog"
    />

    <DeleteOrderDialog
      :d_value="deleteOrderDialog"
      :d_title="d_data.d_title"
      :d_message="d_data.d_message"
      :d_cancel="d_data.d_cancel"
      :d_accept="d_data.d_accept"
      :d_color="d_data.d_color"
      :d_icon="d_data.d_icon"
      @dialog-accept="deleteOrder(order.id_order)"
      @dialog-cancel="cancelDeleteOrder()"
      class="v-dialog"
    />

    <v-dialog v-model="editingDialog" hide-overlay persistent width="300">
      <v-card color="lightred" class="pt-4">
        <v-card-text>
          Guardando los cambios
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

    <v-row>
      <v-col
        v-for="(product, index) in order.o_products"
        :key="index"
        v-model="order.o_products"
      >
        <v-card
          width="400"
          class="ml-4 pa-5 mb-5 rounded-xl fill-height"
          elevation="4"
          color="secondary"
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
                <v-col justify-content="start" class="pa-0">
                  <span class="ma-0 font-weight-bold">{{
                    product.p_name
                  }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0">
                  <span class="ma-0 font-weight-light">{{
                    product.b_name
                  }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0">
                  <span class="ma-0 font-weight-bold"
                    >${{ parseFloat(product.p_price).toFixed(2) }} MXN</span
                  >
                </v-col>
              </v-row>
            </v-col>

            <!-- Editable product -->
            <v-col align-self="center" v-if="order.o_status == 'p'">
              <v-row>
                <v-col>
                  <div class="d-flex quantityContainer">
                    <button @click="decrement(product)">-</button>
                    <input
                      type="number"
                      v-model="product.op_quantity"
                      min="1"
                    />
                    <button @click="increment(product)">+</button>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    large
                    color="lighterred"
                    width="99px"
                    height="33px"
                    rounded
                    elevation="0"
                    @click="openDeleteDialog(product.id_product)"
                  >
                    <v-icon color="error">fas fa-trash</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>

            <!-- Default product -->
            <v-col class="d-flex justify-center align-center" v-else>
              <v-row>
                <div class="quantityContainer centered">
                  <span class="quantity">X{{ product.op_quantity }}</span>
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div style="background-color: var(--bone); margin-top: 50px">
      <v-row color="bone">
        <v-col cols="1">
          <v-badge
            :color="statusProps[order.o_status].badge_color"
            align="center"
          ></v-badge>
        </v-col>
        <v-col cols="8">
          <p>Total</p>
          <h1>${{ parseFloat(order.o_total).toFixed(2) }} MXN</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="my-auto" cols="2">
          <v-row class="mb-2" v-if="order.o_status == 'p'">
            <v-chip
              large
              class="mr-2 pa-6"
              :disabled="editDisable"
              @click="updateOrder()"
              :text-color="statusProps[order.o_status].text_color"
              :color="statusProps[order.o_status].color"
            >
              <v-icon left> {{ statusProps[order.o_status].icon }}</v-icon>
              {{ statusProps[order.o_status].button_text }}
            </v-chip>
          </v-row>
          <v-row v-else class="mb-2">
            <v-chip
              large
              class="mr-2 pa-6"
              :text-color="statusProps[order.o_status].text_color"
              :color="statusProps[order.o_status].color"
            >
              <v-icon left> {{ statusProps[order.o_status].icon }}</v-icon>
              {{ statusProps[order.o_status].button_text }}
            </v-chip>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Order } from "/firebaseAPI/controllers/order.js";
import DeleteProductDialog from "@/components/Dialog.vue";
import DeleteOrderDialog from "@/components/Dialog.vue";

export default {
  name: "OrderDetails",

  props: ["originalOrder", "order"],

  components: {
    DeleteProductDialog,
    DeleteOrderDialog,
  },

  data: () => {
    return {
      disableInteraction: false,

      editingDialog: false,

      deleteOrderDialog: false,

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

      orderedProducts: [],
      lastProduct: {},
      selectedProductId: null,

      editDisable: true,

      statusProps: {
        d: {
          text_color: "secondary",
          button_text: "Entregada",
          badge_color: "#2D3440",
          color: "rgba(45, 52, 64, 0.5)",
          icon: "fas fa-check",
        },
        p: {
          text_color: "primary",
          button_text: "Editar orden",
          badge_color: "green",
          color: "accent",
          icon: "fas fa-pencil-alt",
        },
        c: {
          text_color: "secondary",
          button_text: "Cancelada",
          badge_color: "red",
          color: "rgba(239, 66, 76, 0.5)",
          icon: "fas fa-times",
        },
      },
    };
  },

  created() {
    this.calcTotal();
  },

  mounted() {},

  methods: {
    ...mapActions([
      "incrementQuantity",
      "decrementQuantity",
      "deleteProduct",
      "resetOrder",
    ]),

    increment(product) {
      product.op_quantity++;
      this.calcTotal();

      if (
        this.originalOrder.o_products.length === this.order.o_products.length
      ) {
        for (let i = 0; i < this.originalOrder.o_products.length; i++) {
          if (
            this.originalOrder.o_products[i].op_quantity ===
            this.order.o_products[i].op_quantity
          ) {
            this.editDisable = true;
          } else {
            this.editDisable = false;
            return;
          }
        }
      } else {
        this.editDisable = false;
        return;
      }

      this.calcTotal();
      this.editDisable = true;
    },

    decrement(product) {
      product.op_quantity =
        product.op_quantity - 1 < 1 ? 1 : product.op_quantity - 1;
      this.calcTotal();

      if (
        this.originalOrder.o_products.length === this.order.o_products.length
      ) {
        for (let i = 0; i < this.originalOrder.o_products.length; i++) {
          if (
            this.originalOrder.o_products[i].op_quantity ===
            this.order.o_products[i].op_quantity
          ) {
            this.editDisable = true;
          } else {
            this.editDisable = false;
            return;
          }
        }
      } else {
        this.editDisable = false;
        return;
      }
      this.editDisable = true;
    },

    deleteFromOrder(id_product) {
      const ORDER_PRODUCTS_SIZE = this.order.o_products.length;

      for (let i = 0; i < ORDER_PRODUCTS_SIZE; i++)
        if (id_product == this.order.o_products[i].id_product) {
          this.lastProduct = this.order.o_products.splice(i, 1)[0];
          this.calcTotal();
          break;
        }

      this.deleteProductDialog = false;
      this.editDisable = false;
      this.calcTotal();

      if (this.order.o_products.length < 1) {
        this.confirmChangesDialog = false;
        this.d_data.d_title = "Eliminar orden";
        this.d_data.d_message =
          "Parece que ha eliminado todos los productos de esta orden. Como consecuencia, ésta se eliminará del registro, ¿está seguro que desea continuar?";
        this.d_data.d_cancel = "Continuar editando";
        this.d_data.d_accept = "Eliminar orden";
        this.d_data.d_color = "red";
        this.d_data.d_icon = "fas fa-trash";
        this.deleteOrderDialog = true;
      }
    },

    async deleteOrder(id_order) {
      const O = new Order();

      this.disableInteraction = true;
      this.editingDialog = true;

      O.deleteOrder(this.order.firebaseID)
        .then((res) => {
          this.snackbarProps.text = `Orden eliminada correctamente`;
          this.snackbarProps.color = "green";
          this.snackbarProps.icon = "fas fa-check-circle";
          this.snackbarProps.status = true;

          this.editingDialog = false;
          this.deleteOrderDialog = false;
          setTimeout(() => {
            this.$emit("close-dialog");
          }, 1000);
        })
        .catch((err) => {
          this.snackbarProps.text = `Hubo un error al eliminar la orden`;
          this.snackbarProps.color = "red";
          this.snackbarProps.icon = "fas fa-exclamation-circle";
          this.snackbarProps.status = true;
        });
    },

    cancelDeleteOrder() {
      this.order.o_products.push(this.lastProduct);
      this.calcTotal();

      this.deleteOrderDialog = false;
    },

    // TODO-N: Hacer que se modifique el arreglo original con una referencia
    // TODO-(N+1): Hacer que se cierre todo el diálgo para no tener que lidiar con actualizar o así
    async updateOrder() {
      const O = new Order();

      this.disableInteraction = true;
      this.editingDialog = true;

      let tempOrder = JSON.parse(JSON.stringify(this.order)),
        completeProducts = JSON.parse(JSON.stringify(this.order.o_products));

      tempOrder.o_products = JSON.parse(JSON.stringify(this.order.o_products));

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

      O.updateOrder(this.order.firebaseID, tempOrder)
        .then((res) => {
          this.originalOrder.o_products = [];
          completeProducts.forEach((product) => {
            for (let i = 0; i < tempOrder.o_products.length; i++)
              if (product.id_product === tempOrder.o_products[i].id_product) {
                product.op_quantity = tempOrder.o_products[i].op_quantity;
                this.originalOrder.o_products.push(product);
              }
          });

          let sum = 0;
          this.originalOrder.o_products.forEach((prod) => {
            sum += prod.op_quantity * prod.p_price;
          });

          this.originalOrder.o_total = sum;

          this.snackbarProps.text = `Orden modificada correctamente`;
          this.snackbarProps.color = this.order.o_status;
          this.snackbarProps.icon = "fas fa-check-circle";
          this.snackbarProps.status = true;

          this.editingDialog = false;
          setTimeout(() => {
            this.$emit("close-dialog");
          }, 1000);
        })
        .catch((err) => {
          this.snackbarProps.status = true;
          this.snackbarProps.text = `¡Hubo un error al modificar la orden!`;
          this.snackbarProps.color = "red";
          this.snackbarProps.icon = "fas fa-exclamation-circle";

          console.log(err);
          this.editingDialog = false;
        });
    },

    openDeleteDialog(id_product) {
      this.selectedProductId = id_product;
      this.deleteProductDialog = true;
    },

    calcTotal() {
      let sum = 0;
      this.order.o_products.forEach((prod) => {
        sum += prod.op_quantity * prod.p_price;
      });

      this.order.o_total = sum;
    },
  },
};
</script>
