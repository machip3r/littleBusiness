<template>
  <v-container class="my-3 px-5">
    <h2 class="font-weight-bold font-nunito">Nuevo Producto</h2>
    <v-form ref="form" v-model="valid" lazy-validation class="mt-5 mb-10">
      <v-file-input
        label="Foto del producto"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-camera"
        prepend-icon=""
        rules="fileRules"
        filled
        rounded
        dense
        ></v-file-input>
      <v-text-field
        label="Nombre del producto"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-tshirt"
        :rules="emailRules"
        filled
        rounded
        dense
        required
        ></v-text-field>
      <v-text-field
        label="Precio"
        color="primary"
        type="number"
        background-color="secondary"
        prepend-inner-icon="fas fa-dollar-sign"
        :rules="emailRules"
        filled
        rounded
        dense
        required
        ></v-text-field>
      <v-textarea
        label="Descripción"
        no-resize
        rows="7"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-comment-dots"
        :rules="descriptionRules"
        filled
        rounded
        dense
        :value="msg"
        ></v-textarea>
      <v-select
        :items="items"
        label="Categoria"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-tag"
        filled
        rounded
        dense
        required
        ></v-select>
    </v-form>
    <v-footer
      absolute=true
      color="#fff"
      >
      <v-col
        class="text-center"
        cols="12"
        >
        <v-btn
          class="px-16"
          label="Add"
          color="primary"
          large
          dense
          rounded
          >
          <div class="mx-10">
            <v-icon left>
              fas fa-check
            </v-icon>
            Agregar
          </div>
        </v-btn>
      </v-col>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  name: 'AddProduct',
  data() {
    return {
      msg: 'Hola',
      items: ["Categoria 1", "Categoria 2"],
    }
  }
}
</script>

