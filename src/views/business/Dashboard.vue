<template>
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
        <v-icon class="icon-back-business" size="15">fas fa-arrow-left</v-icon>
      </v-btn>
      <h1 class="ml-5">Tablero</h1>
    </v-row>
    <h3 class="mt-8">Hoy</h3>
    <div class="quick-stats">
      <div class="stat-item gradient-background">
        <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
        <div class="stat-value">$100.00 (3)</div>
        <div class="stat-text">Ventas</div>
      </div>
      <div class="stat-item gradient-background">
        <div class="stat-icon"><i class="fas fa-table"></i></div>
        <div class="stat-value">5</div>
        <div class="stat-text">Órdenes pendientes</div>
      </div>
      <div class="stat-item gradient-background">
        <div class="stat-icon"><i class="fas fa-comment"></i></div>
        <div class="stat-value">2</div>
        <div class="stat-text">Nuevas reseñas</div>
      </div>
      <div class="stat-item gradient-background">
        <div class="stat-icon"><i class="fas fa-star"></i></div>
        <div class="stat-value">4.5 / 5</div>
        <div class="stat-text">Calificación</div>
      </div>
    </div>
    <v-row class="mt-6">
      <h3>Órdenes</h3>
      <v-spacer></v-spacer>
      <v-switch
        v-model="dayOrMonth"
        inset
        :label="dayOrMonth ? 'Días' : 'Mes'"
      ></v-switch>
    </v-row>
    <div class="order-graph-container">
      <v-chip-group
        mandatory
        active-class="month-select--active"
        class="ml-6"
        v-if="!dayOrMonth"
      >
        <v-chip v-for="month in months" :key="month">
          <h5>{{ month }}</h5>
        </v-chip>
      </v-chip-group>
      <v-sparkline
        :value="value"
        color="error"
        height="100"
        padding="15"
        stroke-linecap="round"
        smooth
        fill
        :labels="dayOrMonth ? days : months"
      >
      </v-sparkline>
    </div>
    <h3 class="mt-6">Productos más vendidos</h3>
    <v-slide-group class="px-6">
      <v-slide-item v-for="(product, index) in bestSoldProducts" :key="index">
        <v-card
          class="product-home"
          elevation="0"
          rounded
          @click="seeProduct(product)"
        >
          <v-img class="product-home-img" :src="product.p_photo" />
          <h5>{{ product.sales }} ventas</h5>
          <p>{{ product.p_name }}</p>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <h3 class="mt-6">Productos menos vendidos</h3>
    <v-slide-group class="px-6">
      <v-slide-item v-for="(product, index) in leastSoldProducts" :key="index">
        <v-card
          class="product-home"
          elevation="0"
          rounded
          @click="seeProduct(product)"
        >
          <v-img class="product-home-img" :src="product.p_photo" />
          <h5>{{ product.sales }} ventas</h5>
          <p>{{ product.p_name }}</p>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      value: [423, 446, 675, 510, 590, 610, 760, 423, 446, 675, 510, 590],
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
      dayOrMonth: true,
      months: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      bestSoldProducts: {
        p_name: "",
        p_sales: 0,
      },
      leastSoldProducts: {
        p_name: "",
        p_sales: 0,
      },
    };
  },

  methods: {
    async goBackToProfile() {
      this.$router.push({ name: "User" });
    },
  },
};
</script>
