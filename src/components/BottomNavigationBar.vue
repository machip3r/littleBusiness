<template>
  <v-bottom-navigation
    :active.sync="bottomNav"
    color="accent"
    background-color="primary"
    shift
    fixed
    grow
    v-if="isClientNavigation || isSellerNavigation"
  >
    <v-btn v-for="item in items" :key="item.title" link :to="{name: item.to}">
      <span>{{ item.title }}</span>
      <v-icon color="secondary">{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [],
      bottomNav: 0,
      isSeller: 0,
    };
  },

  methods: {},

  computed: {
    isClientNavigation() {
      this.items = [
        {title: "Inicio", icon: "fas fa-store", to: "Home"},
        {title: "Pedidos", icon: "fas fa-shopping-cart", to: "Cart"},
        {title: "Perfil", icon: "fas fa-user", to: "User"},
      ];
      return (
        this.$route.name === "Home" ||
        this.$route.name === "User" ||
        this.$route.name === "Cart"
      );
    },
    isSellerNavigation() {
      this.items = [
        {title: "Inicio", icon: "fas fa-chart-bar", to: "Dashboard"},
        {title: "Pedidos", icon: "fas fa-shopping-cart", to: "Cart"},
        {title: "Productos", icon: "fas fa-tshirt", to: "Products"},
        {title: "Reseñas", icon: "fas fa-star", to: "Review"},
        {title: "Información", icon: "fas fa-info-circle", to: "Information"},
      ];
      return (
        this.$route.name === "Dashboard" ||
        this.$route.name === "Information" ||
        this.$route.name === "Review" ||
        this.$route.name === "Products"
      );
    },
  },
};
</script>
