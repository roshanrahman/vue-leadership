<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs6>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">Add Student</h3>
          </v-card-title>
          <v-card-text>
            <v-form>
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
      <v-flex xs6>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">Add Course</h3>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Course Name" v-model="courseDetails.coursename"></v-text-field>
              <v-text-field label="Course Code" v-model="courseDetails.coursecode"></v-text-field>
              <v-text-field label="Regulation" v-model="courseDetails.regulation" type="number"></v-text-field>
              <v-select
                v-model="courseDetails.facultyId"
                :items="viewFaculties"
                item-text="name"
                item-value="id"
                label="Choose faculty"
              ></v-select>
              <v-select
                :items="viewStudents"
                v-model="studentsList"
                item-text="registerno"
                item-value="id"
                label="Select students"
                multiple
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
    studentBtnIsLoading: false,
    courseBtnIsLoading: false,
    studentDetails: {
      registerno: null,
      name: null,
      dob: null,
      year: 1999,
      section: null
    },
    courseDetails: {
      coursename: null,
      coursecode: null,
      regulation: 2000,
      facultyId: null
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
        })
        .catch(err => {
          alert(err);
          this.studentBtnIsLoading = false;
        });
    },
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
