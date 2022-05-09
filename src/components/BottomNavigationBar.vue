<template>
  <v-bottom-navigation
    :active.sync="bottomNav"
    :color="color"
    :value="true"
    absolute
    shift
    fixed
    grow
  >
    <v-btn
      v-for="item in itemsHome"
      :key="item.title"
      link
      :to="{name: item.to}"
    >
      <span>{{ item.title }}</span>
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      itemsHome: [
        {title: "Tienda", icon: "fas fa-store", to: "Business"},
        {title: "Pedidos", icon: "fas fa-shopping-cart", to: "Cart"},
        {title: "Perfil", icon: "fas fa-user", to: "User"},
      ],
      itemsStore: [
        {title: "Inicio", icon: "fas fa-chart-bar", to: "Dashboard"},
        {title: "Pedidos", icon: "fas fa-shopping-cart", to: "Cart"},
        {title: "Productos", icon: "fas fa-tshirt", to: "Products"},
        {title: "Reseñas", icon: "fas fa-star", to: "Review"},
        {title: "Información", icon: "fas fa-info-circle", to: "Information"},
      ],
      bottomNav: 0,
    };
  },

  methods: {},

  computed: {
    color() {
      switch (this.bottomNav) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
        default:
          return "blue-grey";
      }
    },
  },
};
</script>
