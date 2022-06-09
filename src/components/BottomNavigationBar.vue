<template>
  <v-bottom-navigation
    background-color="primary"
    shift
    v-model="bottomNav"
    fixed
    grow
    v-if="seller != null && isRouteValid()"
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
      >
        <b>{{ item.title }}</b>
      </span>
      <v-icon :color="keyNav == item.to ? 'primary' : 'secondary'">
        {{ item.icon }}
      </v-icon>
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
      nav: "",
    };
  },

  created() {},

  methods: {
    isRouteValid() {
      return this.$route.name == "AddBusiness" ||
        this.$route.name == "AddProduct" ||
        this.$route.name == "EditProduct" ||
        this.$route.name == "EditBusiness"
        ? false
        : true;
    },
  },
  computed: {
    keyNav: {
      get() {
        return this.$route.name;
      },
      set(newValue) {
        this.nav = newValue;
      },
    },
    items() {
      if (
        this.seller &&
        (this.$route.name == "Dashboard" ||
          this.$route.name == "OrderSeller" ||
          this.$route.name == "Products" ||
          this.$route.name == "Review" ||
          this.$route.name == "Information")
      ) {
        return [
          { title: "Inicio", icon: "fas fa-chart-bar", to: "Dashboard" },
          { title: "Pedidos", icon: "fas fa-shopping-cart", to: "OrderSeller" },
          { title: "Productos", icon: "fas fa-tshirt", to: "Products" },
          { title: "Reseñas", icon: "fas fa-star", to: "Review" },
          {
            title: "Información",
            icon: "fas fa-info-circle",
            to: "Information",
          },
        ];
      } else if (
        (!this.seller && this.$route.name == "OrderClient") ||
        this.$route.name == "ProductsClient" ||
        this.$route.name == "ReviewClient" ||
        this.$route.name == "InformationClient"
      ) {
        return [
          { title: "Productos", icon: "fas fa-tshirt", to: "ProductsClient" },
          { title: "Pedidos", icon: "fas fa-shopping-cart", to: "OrderClient" },
          { title: "Reseñas", icon: "fas fa-star", to: "ReviewClient" },
          {
            title: "Información",
            icon: "fas fa-info-circle",
            to: "InformationClient",
          },
        ];
      } else {
        return [
          { title: "Inicio", icon: "fas fa-store", to: "Home" },
          { title: "Pedidos", icon: "fas fa-shopping-cart", to: "Order" },
          { title: "Perfil", icon: "fas fa-user", to: "User" },
        ];
      }
    },
  },
};
</script>
