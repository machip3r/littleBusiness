<template>
  <div>
    <div class="container-dashboard">
      <v-row class="mt-1 ml-1">
        <v-btn
          class="fab-back-business"
          dark
          color="primary"
          fab
          small
          left
          top
          @click="goBackToProfile()"
        >
          <v-icon class="icon-back-business" size="15"
            >fas fa-arrow-left</v-icon
          >
        </v-btn>
        <h1 class="ml-5">Productos</h1>
      </v-row>
    </div>

    <v-btn
      class="fab-back-business mb-15"
      dark
      color="primary"
      fab
      fixed
      small
      right
      bottom
      @click="openAddProduct()"
    >
      <v-icon class="icon-back-business" size="15">fas fa-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {};
  },

  components: {},

  methods: {
    async goBackToProfile() {
      this.$router.push({ name: "User" });
    },
    async openAddProduct() {
      this.$router.push({ name: "AddProduct" });
    },
  },
};
</script>
