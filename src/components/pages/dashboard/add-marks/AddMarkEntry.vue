<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card v-if="!showMarkEntries">
          <v-card-title primary-title>
            <h3 class="headline">New Mark Entry</h3>
          </v-card-title>
          <v-card-text>
            <h4>Enter the session details (Session date: {{ currentDate }})</h4>
            <br>
            <v-form ref="sessionForm">
              <v-select
                :rules="regulationRule"
                :items="[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]"
                v-model.number="entry.regulation"
                label="Regulation"
                required
              ></v-select>
              <v-select
                :rules="courseRule"
                :items="filteredCourseList"
                item-text="coursename"
                item-value="id"
                required
                ref="form"
                label="Select course"
                v-model="selectedCourse"
              ></v-select>
              <v-text-field
                required
                :rules="countRule"
                label="Enter the no. of students"
                type="number"
                v-model.number="studentCount"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="generateEntries">CONTINUE</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card v-if="showMarkEntries">
          <v-card-title primary-title>
            <h3 class="headline">Enter the marks</h3>
          </v-card-title>
          <v-card-text>
            <v-card :key="entry.itemId" v-for="entry in studentEntryList">
              <v-card-title class="body-2">Student {{ entry.itemId + 1 }}</v-card-title>
              <v-card-text>
                <v-select
                  label="Register No."
                  :items="studentListUnderCourse"
                  item-text="registerno"
                  item-value="id"
                  v-model="entry.studentId"
                ></v-select>
                <v-text-field v-model.number="entry.points" label="Enter the score" type="number"></v-text-field>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="red" @click="cancelEntries">CANCEL</v-btn>

            <v-spacer></v-spacer>

            <v-btn depressed color="primary" @click="submitEntries">CONTINUE</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-snackbar v-model="snackbar" :timeout="5000">Successfully added.
      <v-btn color="teal" flat @click="snackbar = false">Got it</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "AddMarkEntry",
  mounted() {
    this.facultyId = JSON.parse(localStorage.session).id;
  },
  data() {
    return {
      entry: {},
      facultyId: null,
      currentDate: new Date().toISOString().slice(0, 10),
      viewStudents: [],
      viewCourses: [],
      studentCount: null,
      snackbar: false,
      studentEntryList: null,
      showMarkEntries: false,
      selectedCourse: null,
      regulationRule: [v => !!v || "Regulation is required"],
      countRule: [
        v => !!v || "Student count is required",
        v => {
          if (v <= 0 || v > 100) return "Enter a valid number";
        }
      ],
      courseRule: [v => !!v || "Course is required"]
    };
  },
  computed: {
    studentListUnderCourse() {
      const course = this.viewCourses.filter(
        course => course.id === this.selectedCourse
      )[0];
      console.log(course);

      return course.students;
    },
    filteredCourseList() {
      const filteredCourses = this.viewCourses.filter(
        course => course.regulation === this.entry.regulation
      );
      return filteredCourses;
    }
  },
  methods: {
    cancelEntries() {
      (this.studentCount = null), (this.studentEntryList = null);
      this.showMarkEntries = false;
    },
    submitEntries() {
      console.log("FINISHED FIELDS");
      console.log(this.studentEntryList);
      this.showProgressDialog = true;

      this.studentEntryList.forEach(entry => {
        this.addRecordMutation(entry);
      });
      this.snackbar = true;
      this.showMarkEntries = false;
      this.$refs.sessionForm.reset();
    },
    addRecordMutation(entry) {
      console.log("From inside addRecordMutation");
      console.log(entry);

      this.$apollo
        .mutate({
          mutation: gql`
            mutation AddRecord(
              $courseId: String!
              $facultyId: String!
              $studentId: String!
              $points: Int!
              $date: String!
            ) {
              addRecord(
                courseId: $courseId
                facultyId: $facultyId
                studentId: $studentId
                points: $points
                date: $date
              ) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            courseId: entry.courseId,
            facultyId: entry.facultyId,
            studentId: entry.studentId,
            points: entry.points,
            date: entry.date
          }
        })
        .then(response => {
          this.snackbar = true;
          console.log("RESPONSE FROM ADD");
          console.log(response);
        })
        .catch(err => {
          alert(err);
        });
    },
    generateEntries() {
      if (!this.$refs.sessionForm.validate()) {
        return;
      }
      console.log(this.selectedCourse);
      this.studentEntryList = [];
      if (this.studentCount > this.studentListUnderCourse.length) {
        alert(
          "The actual no. of students in your course is lesser than the no. of students you want to enter marks for. Please reduce the no. of students you want to enter marks for."
        );
        return;
      }
      if (this.studentCount) {
        this.showMarkEntries = true;
        for (let i = 0; i < this.studentCount; i++) {
          this.studentEntryList.push({
            courseId: this.selectedCourse,
            facultyId: this.facultyId,
            itemId: i,
            studentId: null,
            points: null,
            date: this.currentDate
          });
        }
      }
      console.log(this.studentEntryList);
    }
  },
  apollo: {
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
    `,
    viewCourses: gql`
      query ViewCourses {
        viewCourses {
          id
          coursename
          coursecode
          regulation
          students {
            id
            registerno
            name
          }
        }
      }
    `
  }
};
</script>

<style>
</style>
