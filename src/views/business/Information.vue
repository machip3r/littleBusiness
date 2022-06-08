<template>
  <div class="container-dashboard">
    <v-row class="mt-1 ml-1">
      <v-col>
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
          <v-icon class="icon-back-business" size="15"
            >fas fa-arrow-left</v-icon
          >
        </v-btn>

        <h1 class="ml-5">Información</h1>
      </v-col>

    </v-row>

    <v-row>
      <v-col>
      <v-row>
      <v-rating
          color="blue"
          empty-icon="far fa-star"
          full-icon="fa-star"
          half-icon="fa-star-half-alt"
          
          length="5"
          readonly
          size="60"
          small
          half-increments
          :value="rateMean"
        
        ></v-rating>
      </v-row>
        

        <div>
          <v-avatar>
            <img :src="user_photo"></img>
          </v-avatar>
          By 
           {{ business.name}}
        </div>
        <p>{{business.b_description}}</p>
      
        <v-row>
          <v-col>
          <v-btn dark color="primary" rounded x-large>DICIS</v-btn>
          </v-col>
          <v-col>
          <v-btn dark color="primary" rounded x-large>$ Prices {{ `$ ${minPrice}-$ ${maxPrice}` }}</v-btn>
          </v-col>
        </v-row>
 
      
      </v-col>
      
      <v-col>
        <h3>Dias disponibles</h3>
       <div v-for="(day, index) in daysOfWeek" :key="index">
        <span>{{day}}</span> <v-chip
                v-for="(item, indexD) in business.b_schedule[index]"
                v-bind:key="indexD"
              
                color="blue"
                class="chips-hour"
              
              >
                {{ `${item.start}:00 - ${item.end}:00` }}
              </v-chip>
       </div>
       </v-col>
    </v-row>
    <v-row>
    <v-col></v-col>
     <v-col>
     
      <v-btn  v-if="isYourBusiness"  @click="goEdit()" dark color="primary" rounded bottom left large>
          <v-icon>fa-edit</v-icon>
        Editar</v-btn>
       </v-col>
    </v-row>
 
  </div>
</template>

<script>
import { getAuth } from '@firebase/auth';
import { Business } from '../../../firebaseAPI/controllers/business';
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
      business: null,
      rateMean: 0,
      minPrice : 0,
      maxPrice: 0,
      isYourBusiness: false,
     
    };
  },
  mounted(){


    const id = this.$route.params.id
    const uid = getAuth().currentUser.uid;
    console.log(uid);
    Business.getBussinesByUId(uid).then((value) => {
        this.isYourBusiness = value.some((item) => (item.id_business = id));
      });
    Business.readBusinessWithID(this.$route.params.id).then(rows=>{
      this.business = rows;
      this.user_photo= getAuth().currentUser.photoURL;
    }).catch(err=>{
      console.error(err);
    });
    Business.getstatistics(this.$route.params.id.toString()).then(value=>{
       this.rateMean =  value.mean;
        this.minPrice = value.minPrice;
        this.maxPrice = value.maxPrice;
    }).catch(err=>console.error(err));

     
  },
  methods: {
    async goBackToProfile() {
      this.$router.push({ name: "User" });
    },

    goEdit(){

      const id = this.$route.params.id;
      this.$router.push({ name: "EditBusiness", params: { id: id } });
    }
  },
};
</script>
