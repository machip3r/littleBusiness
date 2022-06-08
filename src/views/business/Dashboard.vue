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
        <div class="stat-value">
          {{ totalDaySales + "(" + this.totalProducts + ")" }}
        </div>
        <div class="stat-text">Ventas</div>
      </div>
      <div class="stat-item gradient-background">
        <div class="stat-icon"><i class="fas fa-table"></i></div>
        <div class="stat-value">{{ numberOrdersP }}</div>
        <div class="stat-text">Órdenes pendientes</div>
      </div>
      <div class="stat-item gradient-background">
        <div class="stat-icon"><i class="fas fa-comment"></i></div>
        <div class="stat-value">{{ newReviewsCount }}</div>
        <div class="stat-text">Nuevas reseñas</div>
      </div>
      <div class="stat-item gradient-background">
        <div class="stat-icon"><i class="fas fa-star"></i></div>
        <div class="stat-value">{{ meanStars ? meanStars : 0 }} / 5</div>
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
        <v-chip
          v-for="(month, index) in months"
          @click="setMonth(index)"
          :key="month"
        >
          <h5>{{ month }}</h5>
        </v-chip>
      </v-chip-group>
      <v-sparkline
        :value="
          dayOrMonth ? dataMonth.monthData : dataMonth.dataMonthDay[indexMouth]
        "
        color="error"
        height="100"
        padding="15"
        stroke-linecap="round"
        smooth
        fill
        :labels="dayOrMonth ? months : days"
      >
      </v-sparkline>
    </div>
    <h3 class="mt-6">Productos más vendidos</h3>

    <v-slide-group class="px-6">
      <div v-if="bestSoldProducts.length == 0">
        No hay productos que mostrar
      </div>
      <v-slide-item v-for="(product, index) in bestSoldProducts" :key="index">
        <v-card
          class="product-home"
          elevation="0"
          rounded
          @click="seeProduct(product)"
        >
          <v-img class="product-home-img" :src="product.p_photo" />
          <h5>{{ product.total }} ventas</h5>
          <p>{{ product.p_name }}</p>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <h3 class="mt-6">Productos menos vendidos</h3>
    <v-slide-group class="px-6">
      <div v-if="leastSoldProducts.length == 0">
        No hay productos que mostrar
      </div>
      <v-slide-item v-for="(product, index) in leastSoldProducts" :key="index">
        <v-card
          class="product-home"
          elevation="0"
          rounded
          @click="seeProduct(product)"
        >
          <v-img class="product-home-img" :src="product.p_photo" />
          <h5>{{ product.total }} ventas</h5>
          <p>{{ product.p_name }}</p>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  Business,
  getCountReviewDate,
  getDataFromDate,
  getDataOrdersByBusiness,
  getSumProducts,
} from "../../../firebaseAPI/controllers/business";

export default {
  name: "Dashboard",
  data() {
    return {
      days: [],
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
      indexMouth: 0,
      dataMonth: null,
      bestSoldProducts: [],
      leastSoldProducts: [],
      meanStars: 0,
      totalDaySales: 0,
      totalProducts: 0,
      numberOrdersP: 0,
      newReviewsCount: 0,
    };
  },
  computed: {
    ...mapState(["activeBusiness"]),
  },
  mounted() {
    getDataOrdersByBusiness(this.activeBusiness.toString()).then((listOr) => {
      let now = new Date(Date.now());

      listOr.forEach((item) => {
        if (item.o_status == "d") {
          if (
            (item.date.getDate() == now.getDate() &&
              now.getFullYear() == item.date.getFullYear()) ||
            item.data.getMonth() == now.getMonth()
          ) {
            this.totalDaySales = item.op_quantity * item.p_price;
            this.totalProducts += item.op_quantity;
          }
        } else if (item.o_status == "p") {
          this.numberOrdersP++;
        }
      });
    });
    getSumProducts(this.activeBusiness.toString()).then((list) => {
      const listTemp = list.filter((item) => item.o_status == "d");

      if (listTemp.length == 1) {
        this.bestSoldProducts.push(listTemp[0]);
        this.leastSoldProducts.push(listTemp[0]);
      } else if (listTemp.length == 2) {
        this.bestSoldProducts.push(listTemp[1]);
        this.leastSoldProducts.push(listTemp[0]);
      } else if (listTemp.length > 2) {
        const index = listTemp.length - 1;
        this.bestSoldProducts.push(listTemp[index]);
        this.bestSoldProducts.push(listTemp[index - 1]);
        this.leastSoldProducts.push(listTemp[0]);
        this.leastSoldProducts.push(listTemp[1]);
      }
    });
    getDataFromDate(this.activeBusiness.toString()).then((value) => {
      this.dataMonth = value;
      this.fillDays(this.indexMouth);
    });

    Business.getstatistics(this.activeBusiness).then((value) => {
      this.meanStars = value.mean;
    });

    getCountReviewDate(this.activeBusiness).then((value) => {
      this.newReviewsCount = value;
    });
  },
  watch: {
    indexMouth: function (newValue, oldValue) {
      this.fillDays(newValue);
    },

    dayOrMonth: function (newValue, oldValue) {
      if (oldValue == false && newValue == true) {
        this.indexMouth = 0;
      }
    },
  },
  methods: {
    fillDays(month) {
      this.days = [];

      for (let i = 1; i <= this.dataMonth.dataMonthDay[month].length; i++) {
        this.days.push(i);
      }
    },
    setMonth(index) {
      this.indexMouth = index;
    },
    async goBackToProfile() {
      this.$router.push({ name: "User" });
    },
  },
};
</script>
