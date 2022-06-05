<template>
  <v-container fluid class="my-3 px-5">
    <h2 class="font-weight-bold font-nunito">Reviews</h2>
    <v-card
      class="d-flex justify-center align-center"
      elevation="0"
      v-if="allReviews.length < 1"
    >
      <v-card
        class="d-flex flex-column justify-center align-center rounded-xl"
        width="40%"
        height="500px"
        color="bone"
        elevation="0"
      >
        <v-icon class="my-4" size="100">fas fa-receipt</v-icon>
        <h1>Sin reseñas</h1>
        <p>Regresa mas tarde o añade una</p>
      </v-card>

    </v-card>
    <v-card v-else elevation="0">
      <v-row >
        <v-col>
        <v-card
          width="400"
          class="rounded-xl fill-height pa-4 pb-0"
          elevation="4"
          color="secondary" 
          v-if="already"
        >
        <v-row>
          <v-col class="text-center">
            <v-list-item two-line>
              <v-list-item-content >
                <v-list-item-title 
                class="font-weight-bold font-nunito primary--text">
                  <h3>{{averageRate}}/5</h3>
                </v-list-item-title>
                <v-list-item-subtitle
                  class="font-weight-light font-nunito primary--text"
                ><h6>Based on {{businessReviews.length}} reviews</h6></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item >
              
              <v-rating
                :value = averageRate 
                color="accent"
                dense
                half-increments
                half-icon="fas fa-star-half-alt"
                hover
                readonly
                size=" 1vw"
              ></v-rating>

              
            </v-list-item>
          </v-col>
          <v-col >
            <v-sparkline
              :value="value"
              color="accent" 
              height="160%"
              label-size="20"
              auto-line-width
              padding="15"
              type= "bar" 
              :labels="stars"  
               
            >
            </v-sparkline>
          </v-col>
        </v-row>
        </v-card>
        </v-col>
        <v-col
          v-for="(review, index) in businessReviews"
          :key="index"
          v-model="businessReviews"
        >
          <v-card
            width="400"
            class="rounded-xl fill-height"
            elevation="4"
            color="secondary"    
          >
            <v-card-actions class="pa-4 pb-0">
              <span class="font-weight-bold font-nunito primary--text ma-0">
                <h4 style="display:inline;">{{ review.user }}</h4> <h6 style="display:inline;" class="font-weight-light">{{ review.r_datetime }}</h6>
              </span>
              <v-rating
                :value = review.r_rate
                color="accent"
                dense
                hover
                readonly
                size=" 1.5vw"
              ></v-rating>
            </v-card-actions>
             <v-card-text
              class=" font-weight-light font-nunito primary--text pt-1" 
            >
             {{ review.r_description }}
            </v-card-text> 
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card >
      <v-btn
        color="primary"
        absolute
        bottom
        right
        fab
        v-on:click="addReview"
      >
        <v-icon>fa fa-plus</v-icon>
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Review } from "/firebaseAPI/controllers/review.js";
import { getAuth } from '@firebase/auth';
import { User } from "/firebaseAPI/controllers/user.js";

export default {
  name: "Review",

  props: ["reviews"],

  components: { },

  data: () => {
    return {
      already: false,
      averageRate: 0,
      stars: [
        1, 2, 3, 4, 5,
      ],
      value: [0, 0, 0, 0, 0],
      allReviews: [],
      businessReviews: [],
    };
  },

  async created() {
    await this.readDocuments();
    this.getBusinessReviews();
    
  },

  computed: {
    ...mapState(["cart", "user"]),
  },

  methods: {
    ...mapActions([
      "incrementQuantity",
      "decrementQuantity",
      "deleteProduct",
      "resetOrder",
    ]),

    async readDocuments() {
      const R = new Review();
      await R.readReviews().then(
        (res) => (this.allReviews = R.docsObjectToArray(res))
      );
    },

    getBusinessReviews() {
      const REVIEWS_SIZE = this.allReviews.length;
      let i = 0;
      this.allReviews.forEach((prod) => {
        for (i; i < REVIEWS_SIZE; i++) {
          if (prod.id_review == this.allReviews[i].id_review) {
            this.businessReviews.push(
              Object.assign(this.allReviews[i], {
                r_description: prod.r_description,
                r_rate: prod.r_rate,
                id_user: prod.id_user,
                user: this.user.name
              }) 
            );
            break;
          }
        }
      });
      this.getAllRates();
    },
    getAllRates() {
      const REVIEWS_SIZE = this.allReviews.length;
      let i = 0;
      this.businessReviews.forEach((prod) => {
        for (i; i < REVIEWS_SIZE; i++) {
          this.value[this.businessReviews[i].r_rate - 1] ++;
          this.averageRate += this.businessReviews[i].r_rate;
        }
      });
      this.averageRate /= REVIEWS_SIZE;
      this.already = true;
    },
    addReview() {
      this.$router.push("AddReview");
    }
  } 
}
</script>
