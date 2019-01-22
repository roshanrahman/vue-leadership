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
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                lazy
                full-width
                width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="studentDetails.dob"
                  label="Date of Birth"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="studentDetails.dob" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
              <v-text-field v-model="studentDetails.year" label="Year" type="number">Year</v-text-field>
              <v-text-field v-model="studentDetails.section" label="Section">Section</v-text-field>
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
            >SUBMIT</v-btn>
          </v-card-actions>
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
    studentBtnIsLoading: false,
    studentDetails: {
      registerno: null,
      name: null,
      dob: null,
      year: 2016,
      section: null
    }
  }),
  methods: {
    addStudents() {
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
              )
            }
          `,
          variables: {
            registerno: this.studentDetails.registerno,
            name: this.studentDetails.name,
            dob: this.studentDetails.dob,
            year: this.studentDetails.year,
            section: this.studentDetails.section,
            adminId: "55b21b8a-5378-49ea-b096-c9c9e071681b"
          }
        })
        .then(response => {
          console.log(response.data.addStudent);
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
