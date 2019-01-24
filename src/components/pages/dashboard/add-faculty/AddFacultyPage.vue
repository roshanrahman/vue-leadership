<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">Add Faculty</h3>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="facultyDetails.name" label="Name"></v-text-field>
              <v-text-field
                hint="Username should not contain any spaces"
                v-model="facultyDetails.username"
                label="Username"
              ></v-text-field>
              <v-text-field
                hint="Do not forget this password, you cannot view it after adding."
                v-model="facultyDetails.password"
                label="Password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              :loading="studentBtnIsLoading"
              :disabled="studentBtnIsLoading"
              depressed
              color="primary"
              @click="addFaculty"
            >ADD</v-btn>
          </v-card-actions>
          <v-snackbar v-model="snackbar" timeout="3000">Successfully added faculty
            <v-btn color="teal" dark flat @click="snackbar = false">Got it</v-btn>
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
    snackbar: false,
    adminId: null,
    studentBtnIsLoading: false,
    facultyDetails: {
      name: null,
      username: null,
      password: null
    }
  }),
  mounted() {
    this.adminId = JSON.parse(localStorage.session).id;
  },
  methods: {
    addFaculty() {
      this.studentBtnIsLoading = true;
      console.log(this.viewFaculties);
      this.$apollo
        .mutate({
          mutation: gql`
            mutation AddFaculty(
              $name: String!
              $username: String!
              $password: String!
              $adminId: String!
            ) {
              addFaculty(
                name: $name
                username: $username
                password: $password
                adminId: $adminId
              ) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            name: this.facultyDetails.name,
            username: this.facultyDetails.username,
            password: this.facultyDetails.password,
            adminId: this.adminId
          }
        })
        .then(response => {
          console.log(response.data.addFaculty);
          if (response.data.addFaculty.errors) {
            //Something went wrong
            alert("Something wrong happened");
          } else {
            this.snackbar = true;
          }
          this.studentBtnIsLoading = false;
          this.$refs.form.reset();
        })
        .catch(err => {
          alert(err);
          this.studentBtnIsLoading = false;
        });
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
