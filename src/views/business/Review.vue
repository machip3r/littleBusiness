<template>
  <div class="container-dashboard">
    <div>
    <v-row class="mt-1 ml-1 pb-5">
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
      <h1 class="ml-5">Reseñas</h1>
    </v-row>
    </div>
    <v-container>
      <v-card
          class="d-flex justify-center align-center"
          elevation="0"
          v-if="businessReviews.length < 1"
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
          <v-row justify="center">
            <v-chip-group
            active-class="accent--text text--accent"
            mandatory
          >
            <v-chip @click="setMinMax(0,5)">All</v-chip>
            <v-chip @click="setMinMax(4,5)">Good</v-chip>
            <v-chip @click="setMinMax(0,2.5)">Bad</v-chip>
            <v-chip @click="setMinMax(3,3.5)">Normal</v-chip>
          </v-chip-group>
          </v-row>
          <v-row>
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
                      <v-list-item-content>
                        <v-list-item-title
                          class="font-weight-bold font-nunito primary--text"
                        >
                          <h3>{{ averageRate }}/5</h3>
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="font-weight-light font-nunito primary--text"
                          ><h6>
                            Based on {{ businessReviews.length }} reviews
                          </h6></v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-rating
                        :value="averageRate"
                        color="accent"
                        half-increments
                        half-icon="fas fa-star-half-alt"
                        hover
                        readonly
                        dense
                        size="15"
                      ></v-rating>
                    </v-list-item>
                  </v-col>
                  <v-col>
                    <v-sparkline
                      :value="value"
                      color="accent"
                      height="160%"
                      label-size="20"
                      auto-line-width
                      padding="20"
                      type="bar"
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
              v-if="review.r_rate >= min && review.r_rate <= max "
            >
              <v-card-actions class="pa-4 pb-0">
                <span class="font-weight-bold font-nunito primary--text ma-0">
                  <h4 style="display: inline">{{ review.u_name }}</h4>
                  <h6 style="display: inline" class="font-weight-light">
                    {{ review.r_datetime.substr(0, review.r_datetime.indexOf(' ')) }}
                  </h6>
                </span>
                <v-rating
                  :value="review.r_rate"
                  half-increments
                  half-icon="fas fa-star-half-alt"
                  color="accent"
                  dense
                  hover
                  readonly
                  size="15"
                ></v-rating>
              </v-card-actions>
              <v-card-text
                class="font-weight-light font-nunito primary--text pt-1"
              >
                {{ review.r_description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <v-btn
      class=" mb-15"
      dark
      color="primary"
      fab
      fixed
      right
      bottom
      v-on:click="addReview"
    >
      <v-icon class="icon-back-business" size="15">fas fa-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { Review } from "/firebaseAPI/controllers/review.js";
import { User } from "/firebaseAPI/controllers/user.js";

export default {
  name: "Review",
  props: ["reviews"],
  components: {},
  data: () => {
    return {
      min: 0,
      max: 5,
      already: false,
      averageRate: 0,
      stars: [1, 2, 3, 4, 5],
      value: [0, 0, 0, 0, 0],
      allReviews: [],
      businessReviews: [],
    };
  },
  async created() {
    this.already = false;
    await this.readDocuments();
    await this.getBusinessReviews();
  },

  methods: {
    async readDocuments() {
      const R = new Review();
      await R.readReviews().then(
        (res) => (this.allReviews = R.docsObjectToArray(res))
      );
    },
    async getBusinessReviews() {
      const REVIEWS_SIZE = this.allReviews.length;
      let i = 0;
      let names = [];
      for (let n = 0; n < REVIEWS_SIZE; n++) {
        names[n] = await User.getAdditionalDataUser(this.allReviews[n].id_user);
      }
      const id = this.$route.params.id;
      for (i; i < REVIEWS_SIZE; i++) { 
        if (this.allReviews[i].id_business == id) {
          this.businessReviews.push(
            Object.assign(this.allReviews[i], {
              r_description: this.allReviews[i].r_description,
              r_rate: parseFloat(this.allReviews[i].r_rate),
              id_user: this.allReviews[i].id_user,
              u_name: names[i].u_name,
            })
          );
        }
      }
      this.businessReviews = this.businessReviews.sort((a,b) => a.r_datetime > b.r_datetime);
      this.getAllRates();
    },
    getAllRates() {
      const REVIEWS_SIZE = this.businessReviews.length;
      let i = 0;
      this.businessReviews.forEach((prod) => {
        for (i; i < REVIEWS_SIZE; i++) {
          if ( this.businessReviews[i].r_rate%1 != 0) {
            this.value[this.businessReviews[i].r_rate - 0.5]++;
          }
          else 
            this.value[this.businessReviews[i].r_rate - 1]++;
          this.averageRate += this.businessReviews[i].r_rate;
        }
      });
      this.averageRate /= REVIEWS_SIZE;
      this.averageRate = parseFloat(this.averageRate.toFixed(1));
      this.already = true;
    },
    addReview() {
      let id = this.$route.params.id;
      this.$router.push({ name: "AddReview", params: { id: id } });
    },
    setMinMax(mi, ma) {
      this.min = mi;
      this.max = ma;
    },
    async goBackToProfile() {
      this.$router.push({ name: "User" });
    },
  },
};
</script>
