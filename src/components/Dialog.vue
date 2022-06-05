<template>
  <!-- <v-row justify="center"> -->
  <v-dialog v-model="d_value" max-width="500" persistent>
    <v-card color="secondary">
      <v-toolbar color="secondary" elevation="0" dense class="pt-2">
        <v-toolbar-title class="font-weight-bold font-nunito primary--text"
          ><v-icon :color="d_color">fa fa-exclamation-circle</v-icon>
          {{ d_title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn class="rounded-circle" icon @click="$emit('dialog-cancel')">
            <v-icon color="primary">fas fa-times</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text
        class="mt-2 font-weight-light font-nunito text-left pb-1 primary--text"
        ma-0
      >
        {{ d_message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="white"
          class="primary--text font-weight-bold text-capitalize"
          rounded
          depressed
          small
          @click="$emit('dialog-cancel')"
        >
          {{ d_cancel }}
        </v-btn>
        <v-btn
          :color="d_color"
          class="white--text font-weight-bold text-capitalize"
          rounded
          depressed
          small
          @click="$emit('dialog-accept')"
          ><v-icon left color="white">{{ d_icon }}</v-icon>
          {{ d_accept }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- </v-row> -->
</template>

<script>
export default {
  props: {
    d_title: String,
    d_message: String,
    d_cancel: String,
    d_accept: String,
    d_value: {
      type: [String, Boolean],
      default: false,
    },
    d_color: String,
    d_icon: String,
  },
  emits: ["dialog-cancel", "dialog-accept"],
};
</script>
