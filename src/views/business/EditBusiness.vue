<template>
  <div class="container-addBusiness">
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
      <h1 class="ml-5">Editar negocio</h1>
    </v-row>
    <v-form class="mt-10" ref="form" v-model="valid" lazy-validation>
      <div>
        <v-text-field
          filled
          label="Nombre de tu negocio"
          prepend-inner-icon="fas fa-store"
          :rules="this.rules.required"
          v-model="b_name"
        >
        </v-text-field>
        <v-textarea
          filled
          auto-grow
          prepend-inner-icon="fas fa-comment"
          label="¿Cómo describirías tu negocio?"
          rows="4"
          v-model="b_description"
          :rules="this.rules.required"
          row-height="30"
        ></v-textarea>
        <v-combobox
          :items="categories"
          item-text="c_name"
          v-model="categorySelected"
          label="Categoria"
          @mouseover="getCategoriesCbx()"
          :rules="this.rules.required"
          filled
        ></v-combobox>
        <h4>Horario</h4>
        <div>
          <v-alert
            color="red"
            dismissible
            type="error"
            style="margin-top: 1rem"
            v-model="messageErrorShow"
          >
            {{ messageError }}
          </v-alert>
          <div v-for="(day, index) in daysOfWeek" :key="index">
            <div class="d-flex align-center-flex">
              <label class="flex-col1">{{ day }}</label>
              <v-text-field
                placeholder="Inicio"
                filled
                rounded
                dense
                v-model="textDays[index].start"
              ></v-text-field>
              <v-text-field
                placeholder="Final"
                filled
                v-model="textDays[index].end"
                rounded
                dense
              ></v-text-field>
              <v-btn
                class="mx-2"
                fab
                dark
                color="indigo"
                @click="addHour(index)"
              >
                <v-icon color="white">fas fa-plus</v-icon>
              </v-btn>
            </div>
            <div class="container-hours">
              <v-chip
                v-for="(item, indexD) in dataDay[index]"
                v-bind:key="indexD"
                close
                color="blue"
                class="chips-hour"
                @click:close="deleteHour(index, indexD)"
              >
                {{ `${item.start}:00 - ${item.end}:00` }}
              </v-chip>
            </div>
          </div>
        </div>
        <v-btn
          class="mt-15 button-continue button button-register"
          rounded
          dense
          large
          @click="editBusiness()"
        >
          <v-icon class="mr-3" color="white">fas fa-edit</v-icon>
          Editar
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCategories } from "../../../firebaseAPI/controllers/category.js";
import { getAuth } from "firebase/auth";
import { Business } from "../../../firebaseAPI/controllers/business.js";
export default {
  name: "EditBusiness",
  computed: {
    ...mapState(["rules"]),
  },

  data: () => {
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
      dataDay: [[], [], [], [], [], [], []],
      textDays: [
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
      ],
      valid: true,
      messageErrorShow: false,
      messageError: "",
      categories: [],
      categorySelected: "",
      b_name: "",
      b_description: "",
    };
  },

  mounted() {
    const id = this.$route.params.id;

    Business.readBusinessWithID(id).then((business) => {
      this.dataDay = business.b_schedule;
      this.b_name = business.b_name;
      this.b_description = business.b_description;

      getCategories().then((categoriesT) => {
        this.categories = categoriesT;
        this.categorySelected = this.categories.find(
          (item) => item.id_category == business.id_category
        );
      });
    });
  },
  methods: {
    async goBackToProfile() {
      this.$router.push({ name: "User" });
    },
    async getCategoriesCbx() {
      this.categories = await getCategories();
    },
    addHour(index) {
      const hourToAdd = {
        start: this.textDays[index].start,
        end: this.textDays[index].end,
      };

      if (this.validateHour(hourToAdd, index))
        this.dataDay[index].push(hourToAdd);
    },
    deleteHour(index, indexD) {
      this.dataDay[index].splice(indexD, 1);
    },
    validateHour(hourToAdd, index) {
      const end = Number.isInteger(Number(hourToAdd.end))
        ? Number(hourToAdd.end)
        : null;
      const start = Number.isInteger(Number(hourToAdd.start))
        ? Number(hourToAdd.start)
        : null;

      if (!end || !start) {
        this.messageErrorShow = true;
        this.messageError = "Escriba valores correctos";
        return false;
      } else if (end == "" || start == "") {
        this.messageErrorShow = true;
        this.messageError = "Horario vacio";
        return false;
      } else if (end <= 0 || end > 24 || start <= 0 || start > 24) {
        this.messageErrorShow = true;
        this.messageError = "Escriba un horario correcto";
        return false;
      } else if (end - start <= 0) {
        this.messageErrorShow = true;
        this.messageError = "Escriba un horario congruente";
      } else if (this.dataDay[index].length > 0) {
        const finded = this.dataDay[index].some(
          (hour) => end <= hour.end && start >= hour.start
        );

        if (finded) {
          this.messageErrorShow = true;
          this.messageError = "Horas repetidas";
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    async editBusiness() {
      const value = this.$refs.form.validate();
      if (value) {
        let validationDataDay = false;
        this.dataDay.forEach((item) => {
          if (item.length > 0) validationDataDay = true;
        });

        if (validationDataDay) {
          let newBusiness = new Business(
            getAuth().currentUser.uid,
            this.categorySelected.id_category,
            this.b_name,
            this.b_description,
            true,
            JSON.stringify(this.dataDay)
          );

          let result = await newBusiness.update(this.$route.params.id);

          if (result) {
            this.$router.push({
              name: "Information",
              params: { id: this.$route.params.id },
            });
          } else {
            this.messageErrorShow = true;
            this.messageError = "No se puedo actualizar el negocio";
          }
        } else {
          this.messageErrorShow = true;
          this.messageError = "No se introdujeron horarios";
        }
      }
    },
  },
};
</script>

<style></style>
