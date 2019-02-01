<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">Add Course</h3>
          </v-card-title>
          <v-card-text>
            <v-form lazy-validation ref="form">
              <v-text-field required label="Course Name" v-model="courseDetails.coursename"></v-text-field>
              <v-text-field required label="Course Code" v-model="courseDetails.coursecode"></v-text-field>
              <v-select
                :items="[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]"
                v-model.number="courseDetails.regulation"
                label="Regulation"
                required
              ></v-select>
              <v-select
                v-model="courseDetails.facultyId"
                :items="viewFaculties"
                item-text="name"
                item-value="id"
                required
                ref="form"
                label="Choose faculty"
              ></v-select>
              <v-select
                :items="filteredStudentList"
                v-model="studentsList"
                item-text="registerno"
                item-value="id"
                label="Select students"
                multiple
                required
                chips
                deletable-chips
                hint="You can choose multiple students"
                persistent-hint
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              depressed
              :loading="courseBtnIsLoading"
              :disabled="courseBtnIsLoading"
              color="primary"
              @click="addCourse"
            >ADD</v-btn>
          </v-card-actions>
          <v-snackbar v-model="snackbar" timeout="3000">Successfully added course.
            <v-btn flat color="teal" @click="snackbar = false">Got it</v-btn>
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
    viewFaculties: [],
    viewStudents: [],
    studentsList: null,
    adminId: null,
    courseBtnIsLoading: false,
    courseDetails: {
      coursename: null,
      coursecode: null,
      regulation: 2016,
      facultyId: null
    }
  }),
  mounted() {
    this.adminId = JSON.parse(localStorage.session).id;
  },
  computed: {
    filteredStudentList() {
      const filteredList = this.viewStudents.filter(
        student => student.year === this.courseDetails.regulation
      );
      console.log(filteredList);

      return filteredList;
    }
  },
  methods: {
    addCourse() {
      this.courseBtnIsLoading = true;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation AddCourse(
              $coursename: String!
              $coursecode: String!
              $regulation: Int!
              $facultyId: String!
              $studentsId: [String!]
              $adminId: String!
            ) {
              addCourse(
                coursename: $coursename
                coursecode: $coursecode
                regulation: $regulation
                facultyId: $facultyId
                studentsId: $studentsId
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
            coursename: this.courseDetails.coursename,
            coursecode: this.courseDetails.coursecode,
            regulation: this.courseDetails.regulation,
            facultyId: this.courseDetails.facultyId,
            studentsId: this.studentsList,
            adminId: this.adminId
          }
        })
        .then(response => {
          console.log(response.data.addCourse);
          if (response.data.addCourse.errors) {
            if (response.data.addCourse.errors[0].errorCode) {
              alert(response.data.addCourse.errors[0].message);
            }
          } else {
            this.snackbar = true;
          }
          this.courseBtnIsLoading = false;
          this.$refs.form.reset();
        })
        .catch(err => {
          alert(err);
          console.log(this.courseDetails);
          this.courseBtnIsLoading = false;
        });
    }
  },
  apollo: {
    test: gql`
      query Test {
        test(name: "Hello")
      }
    `,
    viewFaculties: gql`
      query ViewFaculties {
        viewFaculties {
          id
          username
          name
        }
      }
    `,
    viewStudents: gql`
      query ViewStudents {
        viewStudents {
          id
          registerno
          name
          dob
          year
          section
        }
      }
    `
  }
};
</script>

<style>
</style>
