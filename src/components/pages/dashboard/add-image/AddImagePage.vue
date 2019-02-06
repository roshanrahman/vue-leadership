<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">Add Student Image</h3>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <img :src="imageUrl" height="150" v-if="imageUrl">
              <v-text-field
                label="Select Image"
                @click="pickFile"
                v-model="imageName"
                prepend-icon="attach_file"
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
              >
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              :loading="studentBtnIsLoading"
              :disabled="studentBtnIsLoading"
              depressed
              color="primary"
              @click="addStudents"
            >ADD</v-btn>
          </v-card-actions>
          <v-snackbar v-model="snackbar" timeout="3000">Successfully added student.
            <v-btn color="teal" flat @click="snackbar = false">Got it</v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

export default {
  data: () => ({
    response: "response",
    test: "loading",
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    adminId: null,
    snackbar: false,
    studentBtnIsLoading: false,
    studentDetails: {
      registerno: null,
      name: null,
      dob: "1999-01-01",
      year: 2016,
      section: null
    },
    imageName: "",
    imageUrl: "",
    imageFile: ""
  }),
  mounted() {
    this.adminId = JSON.parse(localStorage.session).id;
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    addStudents() {
      console.log(this.imageUrl);
    }
  },
  apollo: {
    test: gql`
      query Test {
        test(name: "Hello")
      }
    `
  }
};
</script>

<style>
</style>
