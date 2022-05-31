<template>
  <div>
    <v-row class="pt-6 px-6 row-title-home" align="center" justify="center">
      <v-col class="col-title-home">
        <h1>Mis órdenes</h1>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-text-field
          label="Buscar"
          color="primary"
          background-color="secondary"
          append-icon="fas fa-search"
          class="input-search"
          filled
          rounded
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <div>
        <v-card class="mx-8 pb-3" flat width="500" elevation="3">
          <v-toolbar class="elevation-0 gradient-background">
            <v-toolbar-text>
              <v-badge></v-badge>
            </v-toolbar-text>
            <v-spacer></v-spacer>
            <v-toolbar-title>Stickers Cool</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-text>
              <v-icon>far fa-calendar</v-icon>
              16 Apr 2021
            </v-toolbar-text>
          </v-toolbar>

          <v-row class="my-3 px-8">
            <v-col cols="7">Total</v-col>
            <v-spacer></v-spacer>
            <v-col cols="3">$10.00 MXN</v-col>
          </v-row>
          <v-card class="ma-1" color="secondary" elevation="0">
            <v-row class="px-8">
              <v-col cols="2">2x</v-col>
              <v-col cols="7">Stickers L</v-col>
              <v-col cols="3">$10.00 MXN</v-col>
            </v-row>
          </v-card>
        </v-card>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Order",
  data: () => {
    return {
      data: [],
    };
  },
  methods: {},
};
</script>

<style></style>
