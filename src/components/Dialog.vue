<template>
  <v-row justify="center" >
    <v-dialog
      :value= "d_value"
      max-width="400"  
      persistent
    >
      <v-card
        style="border-radius: 30px;"
        color="secondary"
      >
        <v-toolbar
          color="secondary"
          elevation="0"
          dense
        >
          <v-toolbar-title  
            class="font-weight-bold font-nunito pt-3 primary--text"   
          ><v-icon :color="d_color">fa fa-exclamation-circle</v-icon>
            {{ d_title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
            icon
            class="pt-3 ma-0"
            @click="$emit('dialog-cancel')"
          >
            <v-icon right color="primary">fa fa-times</v-icon>
          </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!--
        <v-card-title 
          class="font-weight-bold font-nunito pt-3"  
        ><v-icon left color="error">fa fa-exclamation-circle</v-icon>
          {{ d_title }}
        </v-card-title>
        -->
        <v-card-text
          class="font-weight-light font-nunito text-left pb-1 primary--text"
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
            <!--{{ d_cancel }}-->
            No, go back
          </v-btn>
          <v-btn
            :color= "d_color"
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
  </v-row>
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
        default: false
      },
      d_color: String,
      d_icon: String
    },
    emits: ['dialog-cancel','dialog-accept'],
  }
</script>
