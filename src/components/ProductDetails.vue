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
      <h1>$ {{ parseFloat(product.p_price).toFixed(2) }} c/u</h1>
      <div class="d-flex ma-4 align-center">
        <!-- Incrementador y botón de ordenar -->
        <div>
          <!-- Incrementador -->
          <button style="background-color: var(--bone); width: 80px">-</button>
          <input style="background-color: var(--bone)" type="number" disabled />
          <button style="background-color: var(--bone); width: 80px">+</button>
        </div>

        <!-- Order Button -->
        <v-btn class="ml-4">
          <v-icon>fas fa-rocket</v-icon>
          <span>Order</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "ProductDetails",
  props: ["product"],
  data: () => {
    return {};
  },
  methods: {},
};
</script>

<style></style>
