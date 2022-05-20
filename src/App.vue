<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <BottomNavigationBar />
  </v-app>
</template>

<style lang="css">
@import "./styles/main.css";
@import "./styles/login.css";
@import "./styles/user.css";
@import "./styles/product.css";
@import "./styles/receipt.css";
@import "./styles/home.css";
</style>

<script>
import { BottomNavigationBar } from "@/components/BottomNavigationBar";

export default {
  name: "App",

  data: () => ({}),

  components: {
    BottomNavigationBar,
  },
};
</script>
