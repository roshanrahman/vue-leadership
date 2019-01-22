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
              <v-text-field
                required
                label="Regulation"
                v-model="courseDetails.regulation"
                type="number"
              ></v-text-field>
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
                :items="viewStudents"
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
    viewFaculties: "",
    viewStudents: "",
    studentsList: null,
    courseBtnIsLoading: false,
    courseDetails: {
      coursename: null,
      coursecode: null,
      regulation: 2016,
      facultyId: null
    }
  }),
  methods: {
    addCourse() {
      this.courseBtnIsLoading = true;
      console.log(this.courseDetails);
      console.log(this.studentsList);
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
              )
            }
          `,
          variables: {
            coursename: this.courseDetails.coursename,
            coursecode: this.courseDetails.coursecode,
            regulation: parseInt(this.courseDetails.regulation),
            facultyId: this.courseDetails.facultyId,
            studentsId: this.studentsList,
            adminId: "55b21b8a-5378-49ea-b096-c9c9e071681b"
          }
        })
        .then(response => {
          console.log(response.data.addCourse);
          this.courseBtnIsLoading = false;
          this.$refs.form.reset();
        })
        .catch(err => {
          alert(err);
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
