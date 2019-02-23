<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">View All Courses</h3>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :loading="!viewCourses[0]"
              :search="search"
              class="elevation-1"
              hide-actions
              :headers="headers"
              :items="viewCourses"
            >
              <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

              <template slot="items" slot-scope="props">
                <td>{{ props.item.coursecode }}</td>
                <td>{{ props.item.coursename }}</td>
                <td>{{ props.item.regulation }}</td>
                <td>{{ props.item.faculty.name }}</td>
                <td>
                  {{ props.item.students.length }} students
                  <v-btn
                    small
                    round
                    flat
                    color="primary"
                    @click="viewStudentsForCourse(props.item)"
                  >VIEW</v-btn>
                </td>
                <td>
                  <v-icon
                    title="Delete this course"
                    flat
                    color="red accent-4"
                    @click="showDeleteCourseDialog(props.item)"
                  >delete</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="viewStudentsForCourseDialog" scrollable max-width="700px">
      <v-card>
        <v-card-title class="title">Students in {{ viewStudentsForCourseDialogContent.coursename }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 100%;">
          <v-list>
            <v-list-tile
              :key="student.id"
              v-for="student in viewStudentsForCourseDialogContent.students"
            >
              <v-list-tile-title>{{ student.registerno }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ student.name }}</v-list-tile-sub-title>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="viewStudentsForCourseDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewDeleteCourseDialog" scrollable max-width="300px">
      <v-card color="red darken-4" dark>
        <v-card-title class="title">Confirm delete course</v-card-title>
        <v-card-text>Are you sure you want to delete {{ viewDeleteCourseDialogContent.coursename }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" light outline @click="viewDeleteCourseDialog = false">NO</v-btn>
          <v-btn
            color="white"
            light
            flat
            @click="viewDeleteCourseDialog = false; deleteCourse(viewDeleteCourseDialogContent.id)"
          >YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" timeout="3000">Successfully deleted course.
      <v-btn color="teal" flat @click="snackbar = false">Got it</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      search: null,
      adminId: null,
      snackbar: false,
      viewStudentsForCourseDialog: false,
      viewDeleteCourseDialog: false,
      viewDeleteCourseDialogContent: [],
      viewStudentsForCourseDialogContent: [],
      headers: [
        {
          text: "Course Code",
          value: "coursecode"
        },
        {
          text: "Course Name",
          value: "coursename"
        },
        {
          text: "Regulation",
          value: "regulation"
        },
        {
          text: "Faculty",
          value: "faculty.name"
        },
        {
          text: "Students",
          value: "students.length"
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false
        }
      ],
      viewCourses: []
    };
  },
  mounted() {
    console.log(this.viewCourses);
    this.adminId = JSON.parse(localStorage.session).id;
    this.$apollo.queries.viewCourses.refetch();
  },
  methods: {
    viewStudentsForCourse(course) {
      this.viewStudentsForCourseDialogContent = course;
      this.viewStudentsForCourseDialog = true;
    },
    showDeleteCourseDialog(course) {
      this.viewDeleteCourseDialogContent = course;
      this.viewDeleteCourseDialog = true;
    },
    deleteCourse(courseId) {
      console.log("Deleted " + courseId);
      console.log("Admin Id" + this.adminId);
      this.$apollo
        .mutate({
          mutation: gql`
            mutation DeleteCourse($courseId: String!, $adminId: String!) {
              deleteCourse(courseId: $courseId, adminId: $adminId) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            courseId: courseId,
            adminId: this.adminId
          }
        })
        .then(response => {
          if (response.data.deleteCourse.errors) {
            alert(
              "An error occurred. Server says: " +
                response.data.errors[0].message
            );
            return;
          }
          this.snackbar = true;
          console.log("RESPONSE FROM DELETE");
          console.log(response);
          this.$apollo.queries.viewCourses.refetch();
        })
        .catch(err => {
          alert(err);
        });
    }
  },
  apollo: {
    viewCourses: gql`
      query ViewCourses {
        viewCourses {
          id
          coursecode
          coursename
          regulation
          faculty {
            name
          }
          students {
            name
            registerno
          }
        }
      }
    `
  }
};
</script>

<style>
</style>
