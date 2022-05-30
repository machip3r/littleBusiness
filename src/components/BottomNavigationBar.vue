<template>
  <v-bottom-navigation
    background-color="primary"
    shift
    v-model="bottomNav"
    fixed
    grow
    v-if="seller != null"
  >
    <v-btn
      v-for="item in items"
      :key="item.to"
      link
      :to="{ name: item.to }"
      @click="keyNav = item.to"
      :style="{
        backgroundColor:
          keyNav == item.to ? 'var(--light-blue)' : 'var(--dark-blue)',
      }"
    >
      <span
        :style="{
          color: keyNav == item.to ? 'var(--dark-blue)' : 'var(--bone)',
        }"
        ><b>{{ item.title }}</b></span
      >
      <v-icon :color="keyNav == item.to ? 'primary' : 'secondary'">{{
        item.icon
      }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomNavigationBar",
  props: ["seller"],
  data() {
    return {
      bottomNav: 0,
    };
  },

  created() {
    if (this.seller) this.sellerNavigation();
    else this.clientNavigation();
  },

  methods: {},
  computed: {
    keyNav() {
      return this.$route.name;
    },
    items() {
      if (this.seller) {
        return [
          { title: "Inicio", icon: "fas fa-chart-bar", to: "Dashboard" },
          { title: "Pedidos", icon: "fas fa-shopping-cart", to: "Cart" },
          { title: "Productos", icon: "fas fa-tshirt", to: "Products" },
          { title: "Reseñas", icon: "fas fa-star", to: "Review" },
          {
            title: "Información",
            icon: "fas fa-info-circle",
            to: "Information",
          },
        ];
      } else {
        return [
          { title: "Inicio", icon: "fas fa-store", to: "Home" },
          { title: "Pedidos", icon: "fas fa-shopping-cart", to: "Cart" },
          { title: "Perfil", icon: "fas fa-user", to: "User" },
        ];
      }
    },
  },
};
</script>
