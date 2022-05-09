<template>
  <nav>
    <v-navigation-drawer
      v-model="drawer"
      width="80"
      color="primary"
      permanent
      app
    >
      <v-list-item link :to="{name: 'About'}" class="px-2">
        <v-spacer></v-spacer>
        <v-list-item-icon class="list-item-icon-top">
          <v-icon size="30">fas fa-code </v-icon>
        </v-list-item-icon>
        <v-spacer></v-spacer>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="{name: item.to}"
          class="list-item"
        >
          <v-spacer></v-spacer>
          <v-list-item-icon class="list-item-icon">
            <v-icon size="30">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-spacer></v-spacer>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
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
      mini: true,
    };
  },
};
</script>
