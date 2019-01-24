<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">Add Student</h3>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="studentDetails.registerno" label="Register No.">Regno</v-text-field>
              <v-text-field v-model="studentDetails.name" label="Name">Name</v-text-field>

              <v-text-field
                v-model="studentDetails.dob"
                label="Date of Birth (YYYY-MM-DD)"
                hint="Must be in format YYYY-MM-DD"
              ></v-text-field>

              <v-select
                :items="[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]"
                v-model.number="studentDetails.year"
                label="Regulation"
                required
              ></v-select>
              <v-select
                :items="['A', 'B', 'C']"
                v-model.number="studentDetails.section"
                label="Section"
                required
              ></v-select>
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
    }
  }),
  mounted() {
    this.adminId = JSON.parse(localStorage.session).id;
  },
  methods: {
    addStudents() {
      if (!/(\d{4})-(\d{2})-(\d{2})/.test(this.studentDetails.dob)) {
        alert("Date of Birth should be of format YYYY-MM-DD");
        return;
      }
      this.studentBtnIsLoading = true;
      console.log(this.viewFaculties);
      this.$apollo
        .mutate({
          mutation: gql`
            mutation AddStudent(
              $registerno: String!
              $name: String!
              $dob: String!
              $year: Int!
              $section: String!
              $adminId: String!
            ) {
              addStudent(
                registerno: $registerno
                name: $name
                dob: $dob
                year: $year
                section: $section
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
            registerno: this.studentDetails.registerno,
            name: this.studentDetails.name,
            dob: this.studentDetails.dob,
            year: this.studentDetails.year,
            section: this.studentDetails.section,
            adminId: this.adminId
          }
        })
        .then(response => {
          console.log(response.data.addStudent);
          if (response.data.addStudent.errors) {
            //Something wrong happened
            alert(
              "An error ocurred: " + response.data.addStudent.errors[0].message
            );
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
