<template>
  <v-container fluid class="my-3 px-5">
    <v-row fluid>
      <v-btn class="" @click="goBack()" fab elevation="0" color="primary">
        <v-icon color="secondary">fas fa-arrow-left</v-icon>
      </v-btn>
      <h2 class="font-weight-bold font-nunito">&nbsp; Add Review</h2>
    </v-row>
    <v-row>
      <v-col class="d-none d-sm-flex" cols="2" md="3"></v-col>
      <v-col cols="7" sm="5" md="4" class="pr-0 ml-2 ml-sm-0 pr-sm-2 pr-md-9 pr-lg-13" align-self="center">
        <v-rating
          v-model="rating"
          half-increments
          half-icon="fas fa-star-half-alt"
          color="accent"
          size="70"
          length="5"
        ></v-rating>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-none d-sm-flex" cols="2" md="3"></v-col>
      <v-col cols="12" sm="8" md="6" align-self="center">
        <v-form ref="form" lazy-validation class="mt-5 mb-10" v-model="valid">
          
          <v-textarea
            v-model="review.r_description"
            label="Descripción"
            no-resize
            rows="7"
            color="primary"
            background-color="secondary"
            prepend-inner-icon="fas fa-comment-dots"
            filled
            rounded
            dense
          ></v-textarea>
          <v-col class="text-center" cols="12">
            <v-btn
              class="px-16"
              label="Add"
              color="primary"
              rows="12"
              x-large
              block
              rounded
              v-on:click="addNewReview"
            >
              <div class="mx-10">
                <v-icon left> fas fa-check </v-icon>
                Agregar
              </div>
            </v-btn>
          </v-col>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Review } from "/firebaseAPI/controllers/review.js";
import { getAuth } from "firebase/auth";

export default {
  name: "AddReview",
  components: {},

  data() {
    return {
      rating: 1,
      props: {
        star: 3,
        hasresults: true,
        starsize: "lg",
        maxstars: 5,
        disabled: false,
      },
    
      valid: true,
      
      review: {
        id_user: 1,
        id_business: 1,
        r_rate: 1,
        r_description: "",
        r_datetime: "",
        r_status: false,
      },
     
    };
  },

  async created() {},

  methods: {
    getStars(stars) {
      this.star = stars;
    },
    async addNewReview() {
      if (this.$refs.form.validate()) {
        const review = new Review();
        this.review.id_user = getAuth().currentUser.uid;
        this.review.id_business = 1;
        this.review.r_rate = this.rating;
        this.review.r_datetime = this.getDate();
        await review.addReview(this.review).then().catch();
        this.$router.push("Review");
      } else {
        //
      }
    },
    getDate() {
      const today = new Date();
      return `${today.getFullYear()}-${today.getMonth().toString()}-${today.getDate().toString()} ${
        today.getHours().toString()}:${today.getMinutes().toString()}:${today.getSeconds().toString()}`;
    },

    goBack() {
      this.$router.back();
    },
  },
};
</script>
