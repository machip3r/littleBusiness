<template>
  <div class="container-dashboard container-information">
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
      <h1 class="ml-5">Información</h1>
    </v-row>
    <div class="container-info-business">
      <div class="principal-information">
        <div class="rating-container">
          <v-rating
            color="accent"
            empty-icon="far fa-star"
            full-icon="fa-star"
            half-icon="fa-star-half-alt"
            length="5"
            readonly
            size="40"
            dense
            half-increments
            :value="rateMean"
          ></v-rating>
        </div>
        <h1 class="mt-3">{{ business.b_name }}</h1>
        <v-chip class="seller-chip" pill color="secondary">
          <v-avatar left>
            <img :src="user_photo" />
          </v-avatar>
          <h5>Por {{ business.name }}</h5>
        </v-chip>
        <p class="mt-5">{{ business.b_description }}</p>
        <v-chip class="mt-3 chip-prices" dark color="primary" label>
          $ Precios {{ `$ ${minPrice} - $ ${maxPrice}` }}
        </v-chip>
      </div>
      <div class="schedule-information">
        <h4>Disponibilidad</h4>
        <div class="mt-3">
          <!-- <div class="mt-1" v-for="(day, index) in daysOfWeek" :key="index">
            <span class="mr-3">{{ day }}</span>
            <v-chip
              v-for="(item, indexD) in business.b_schedule[index]"
              v-bind:key="indexD"
              :color="item != [] ? 'accent' : 'secondary'"
              class="chips-hour"
            >
              {{ `${item.start}:00 - ${item.end}:00` }}
            </v-chip>
          </div> -->
          <div class="my-2 day-schedule">
            <h5 class="mr-3">Lunes</h5>
            <div v-if="business.b_schedule[0].length != 0">
              <v-chip
                v-for="(item, indexD) in business.b_schedule[0]"
                v-bind:key="indexD"
                color="accent"
                class="chips-hour ml-2"
              >
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
            <div v-else>
              <v-chip class="no-schedule-chip" color="secondary"></v-chip>
            </div>
          </div>
          <div class="my-2 day-schedule">
            <h5 class="mr-3">Martes</h5>
            <div v-if="business.b_schedule[1].length != 0">
              <v-chip
                v-for="(item, indexD) in business.b_schedule[1]"
                v-bind:key="indexD"
                color="accent"
                class="chips-hour ml-2"
              >
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
            <div v-else>
              <v-chip class="no-schedule-chip" color="secondary"></v-chip>
            </div>
          </div>
          <div class="my-2 day-schedule">
            <h5 class="mr-3">Miércoles</h5>
            <div v-if="business.b_schedule[2].length != 0">
              <v-chip
                v-for="(item, indexD) in business.b_schedule[2]"
                v-bind:key="indexD"
                color="accent"
                class="chips-hour ml-2"
              >
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
            <div v-else>
              <v-chip class="no-schedule-chip" color="secondary"></v-chip>
            </div>
          </div>
          <div class="my-2 day-schedule">
            <h5 class="mr-3">Jueves</h5>
            <div v-if="business.b_schedule[3].length != 0">
              <v-chip
                v-for="(item, indexD) in business.b_schedule[3]"
                v-bind:key="indexD"
                color="accent"
                class="chips-hour ml-2"
              >
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
            <div v-else>
              <v-chip class="no-schedule-chip" color="secondary"></v-chip>
            </div>
          </div>
          <div class="my-2 day-schedule">
            <h5 class="mr-3">Viernes</h5>
            <div v-if="business.b_schedule[4].length != 0">
              <v-chip
                v-for="(item, indexD) in business.b_schedule[4]"
                v-bind:key="indexD"
                color="accent"
                class="chips-hour ml-2"
              >
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
            <div v-else>
              <v-chip class="no-schedule-chip" color="secondary"></v-chip>
            </div>
          </div>
          <div class="my-2 day-schedule">
            <h5 class="mr-3">Sábado</h5>
            <div v-if="business.b_schedule[5].length != 0">
              <v-chip
                v-for="(item, indexD) in business.b_schedule[5]"
                v-bind:key="indexD"
                color="accent"
                class="chips-hour ml-2"
              >
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
            <div v-else>
              <v-chip class="no-schedule-chip" color="secondary"></v-chip>
            </div>
          </div>
          <div class="my-2 day-schedule">
            <h5 class="mr-3">Domingo</h5>
            <div v-if="business.b_schedule[6].length != 0">
              <v-chip
                v-for="(item, indexD) in business.b_schedule[6]"
                v-bind:key="indexD"
                color="accent"
                class="chips-hour ml-2"
              >
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
            <div v-else>
              <v-chip class="no-schedule-chip" color="secondary"></v-chip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-btn
      v-if="isYourBusiness"
      class="fab-home"
      dark
      fab
      large
      color="primary"
      fixed
      right
      bottom
      @click="goEdit()"
    >
      <v-icon size="20">fas fa-edit</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { getAuth } from "@firebase/auth";
import { User } from "../../../firebaseAPI/controllers/user";
import {
  Business,
  getDataBusinessID,
} from "../../../firebaseAPI/controllers/business";
import { mapState } from "vuex";

export default {
  name: "Information",
  data() {
    return {
      daysOfWeek: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ],
      user_photo: "",
      business: {
        name: "",
        b_schedule: [[], [], [], [], [], [], []],
      },
      rateMean: 0,
      minPrice: 0,
      maxPrice: 0,
      isYourBusiness: false,
      isSeller: false,
    };
  },
  computed: {
    ...mapState(["activeBusiness"]),
  },
  mounted() {
    const id = this.$route.params.id;
    const uid = getAuth().currentUser.uid;

    User.getAdditionalDataUser(uid).then((valUser) => {
      Business.getBussinesByUId(uid).then((value) => {
        this.isYourBusiness = value.some((item) => item.id_business == id);
        this.isSeller = valUser.type;
        if (this.isYourBusiness && valUser.type) {
          Business.readBusinessWithID(this.$route.params.id).then((rows) => {
            this.business = rows;
            this.user_photo = getAuth().currentUser.photoURL;
          });
        } else {
          getDataBusinessID(id).then((val) => {
            this.business = val;
            this.user_photo = val.u_photo;
          });
        }
      });
    });

    Business.getstatistics(id).then((value) => {
      this.rateMean = value.mean;
      this.minPrice = value.minPrice;
      this.maxPrice = value.maxPrice;
    });
  },
  methods: {
    async goBackToProfile() {
      if (this.isSeller && this.isYourBusiness) {
        this.$router.push({ name: "User" });
      } else {
        this.$router.go(-1);
      }
    },

    goEdit() {
      const id = this.$route.params.id;
      this.$router.push({ name: "EditBusiness", params: { id: id } });
    },
  },
};
</script>
