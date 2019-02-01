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
                :hint="studentNumberHintString"
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
                  :filter="selectStudentFilter"
                ></v-select>
                <v-text-field v-model.number="entry.points" label="Enter the score" type="number"></v-text-field>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed dark color="red" @click="cancelEntries">CANCEL</v-btn>

            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="submitEntries">SUBMIT</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogEnabled" max-width="500px">
      <v-card color="red darken-4" dark>
        <v-card-title class="title">{{ dialogContent.title }}</v-card-title>
        <v-card-text>{{ dialogContent.content }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" light flat @click="dialogEnabled = false;">GOT IT</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      dialogContent: {},
      dialogEnabled: false,
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
    studentNumberHintString() {
      return "Choose a number less than or equal to the no. of students enrolled in your course.";
    },
    studentListUnderCourse() {
      const course = this.viewCourses.filter(
        course => course.id === this.selectedCourse
      )[0];
      console.log(course);
      const filteredStudents = console.log("filteredStudent", filteredStudents);
      // return course.students.filter(({id})=>!this.studentEntryList.find(({studentId})=>studentId===id ) );
      return course.students;
    },
    filteredCourseList() {
      const filteredCourses = this.viewCourses.filter(
        course =>
          course.regulation === this.entry.regulation &&
          course.faculty.id === this.facultyId
      );
      return filteredCourses;
    }
  },
  methods: {
    customAlert(title, content) {
      this.dialogContent.title = title;
      this.dialogContent.content = content;
      this.dialogEnabled = true;
    },
    selectStudentFilter(item, queryText, itemText) {
      console.log("from methods =======", item, queryText, itemText);
      return true;
    },
    cancelEntries() {
      (this.studentCount = null), (this.studentEntryList = null);
      this.showMarkEntries = false;
    },
    submitEntries() {
      console.log("FINISHED FIELDS");
      console.log(this.studentEntryList);
      this.showProgressDialog = true;
      for (let i = 0; i < this.studentEntryList.length; i++) {
        for (let j = i + 1; j < this.studentEntryList.length; j++) {
          if (
            this.studentEntryList[i].studentId ===
            this.studentEntryList[j].studentId
          ) {
            this.customAlert(
              "Duplicate register numbers detected",
              "You have selected a register number more than once. Please eliminate all duplicates and submit again."
            );
            return;
          }
        }
      }
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
        this.customAlert(
          "Number exceeds no. of students in your course",
          "You are attempting to enter marks for more students than there are in your course. You can choose up to " +
            this.studentListUnderCourse.length +
            ". Please reduce the no. of students you want to enter marks for. "
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
          faculty {
            id
          }
        }
      }
    `
  }
};
</script>

<style>
</style>
