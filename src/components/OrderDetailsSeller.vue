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

    <v-container class="order-container">
      <v-card
        v-for="(product, index) in order.o_products"
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
            <div class="quantityContainer centered">
              <span class="quantity">X{{ product.op_quantity }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-container>

    <v-footer class="footer-order" absolute>
      <div class="total-order-container">
        <h4>${{ parseFloat(order.o_total).toFixed(2) }}</h4>
        <h6 class="ml-3">MXN</h6>
      </div>
      <div class="button-order-area">
        <v-btn
          class="btn-confirm-order"
          @click="updateOrder()"
          text-color="secondary"
          :color="statusProps[order.o_status].color"
        >
          <v-icon size="18">fas fa-cube</v-icon>
          <h6 class="ml-3">Entregar mis productos</h6>
        </v-btn>
      </div>
    </v-footer>
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

    async updateOrder() {
      const O = new Order();

      // this.disableInteraction = true;
      // this.editingDialog = true;

      let tempOrder = JSON.parse(JSON.stringify(this.order)),
        completeProducts = JSON.parse(JSON.stringify(this.order.o_products));

      tempOrder.o_products = JSON.parse(JSON.stringify(this.order.o_products));

      delete tempOrder.firebaseID;
      delete tempOrder.f_datetime;
      delete tempOrder.o_total;

      console.log("tempOrder: ", tempOrder);
      console.log("completeProducts: ", completeProducts);

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

      this.originalOrder
        .updateOrder(this.order.firebaseID, tempOrder)
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

          this.snackbarProps.text = `Productos entregados correctamente`;
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
