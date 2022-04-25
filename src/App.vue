<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>

      <v-btn href="/" text>
        <v-icon>fas fa-home</v-icon>
        &nbsp;
        <span class="mr-2">Home</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn href="/user" text>
        <v-icon>fas fa-home</v-icon>
        &nbsp;
        <span class="mr-2">Users (debug only)</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn href="/login" text>
        <v-icon>fas fa-home</v-icon>
        &nbsp;
        <span class="mr-2">Login</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn href="/signup" text>
        <v-icon>fas fa-home</v-icon>
        &nbsp;
        <span class="mr-2">Sign up</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn href="/products" text>
        <v-icon>fas fa-store</v-icon>
        &nbsp;
        <span class="mr-2">Products</span>
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="css">
@import "./styles/main.css";
@import "./styles/login.css";
@import "./styles/user.css";
</style>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
