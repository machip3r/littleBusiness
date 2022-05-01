<template>
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
                  <button @click="decrementar">-</button>
                  <input type="number" v-model="product.op_quantity" min="1" />
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
                  @click="deleteFromCart(product)"
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
</template>

<script>
module.exports = {
  name: "OrderDetails",

  props: ["products"],

  data: () => {
    return {};
  },

  methods: {},
};
</script>

<style lang="css">
@import "../styles/main.css";
@import "../styles/product.css";
</style>
