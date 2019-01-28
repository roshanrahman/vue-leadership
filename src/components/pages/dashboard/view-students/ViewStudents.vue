<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">View All Students</h3>
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
            <v-data-table :search="search" hide-actions :headers="headers" :items="viewStudents">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.registerno }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.year }}</td>
                <td>{{ props.item.section }}</td>
                <td>{{ props.item.dob }}</td>
                <td>
                  <v-icon
                    title="Delete this student"
                    flat
                    color="red accent-4"
                    @click="showDeleteStudentDialog(props.item)"
                  >delete</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="viewDeleteStudentDialog" scrollable max-width="300px">
      <v-card color="red darken-4" dark>
        <v-card-title class="title">Confirm delete student</v-card-title>
        <v-card-text>Are you sure you want to delete {{ viewDeleteStudentDialogContent.name }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" light outline @click="viewDeleteStudentDialog = false">NO</v-btn>
          <v-btn
            color="white"
            light
            flat
            @click="viewDeleteStudentDialog = false; deleteStudent(viewDeleteStudentDialogContent.id)"
          >YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" timeout="3000">Successfully deleted student.
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
      viewDeleteStudentDialog: false,
      viewDeleteStudentDialogContent: [],
      headers: [
        {
          text: "Register No",
          value: "registerno"
        },
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Year",
          value: "year"
        },
        {
          text: "Section",
          value: "section"
        },
        {
          text: "Date of Birth",
          value: "dob"
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false
        }
      ],
      viewStudents: []
    };
  },
  mounted() {
    console.log(this.viewStudents);
    this.adminId = JSON.parse(localStorage.session).id;
    this.$apollo.queries.viewStudents.refetch();
  },
  methods: {
    showDeleteStudentDialog(Student) {
      this.viewDeleteStudentDialogContent = Student;
      this.viewDeleteStudentDialog = true;
    },
    deleteStudent(inputStudentId) {
      console.log("Deleted " + inputStudentId);
      console.log("Admin Id" + this.adminId);
      this.$apollo
        .mutate({
          mutation: gql`
            mutation DeleteStudent($studentId: String!, $adminId: String!) {
              deleteStudent(studentId: $studentId, adminId: $adminId) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            studentId: inputStudentId,
            adminId: this.adminId
          }
        })
        .then(response => {
          console.log("RESPONSE FROM DELETE");
          console.log(response);
          if (response.data.deleteStudent.errors) {
            alert(
              "An error occurred: " +
                response.data.deleteStudent.errors[0].message
            );
            return;
          }
          this.snackbar = true;
          this.$apollo.queries.viewStudents.refetch();
        })
        .catch(err => {
          alert(err);
        });
    }
  },
  apollo: {
    viewStudents: gql`
      query ViewStudents {
        viewStudents {
          id
          name
          registerno
          dob
          section
          year
        }
      }
    `
  }
};
</script>

<style>
</style>
