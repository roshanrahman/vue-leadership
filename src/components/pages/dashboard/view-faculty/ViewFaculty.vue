<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">View All Faculty</h3>
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
              :loading="!viewFaculties[0]"
              :search="search"
              hide-actions
              class="elevation-1"
              :headers="headers"
              :items="viewFaculties"
            >
              <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.username }}</td>
                <td>
                  <v-icon
                    title="Delete this faculty"
                    flat
                    color="red accent-4"
                    @click="showDeleteFacultyDialog(props.item)"
                  >delete</v-icon>
                </td>
                <td>
                  <v-icon
                    title="Edit this faculty"
                    flat
                    color="grey"
                    @click="showEditFacultyDialog(props.item)"
                  >edit</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="viewDeleteFacultyDialog" scrollable max-width="300px">
      <v-card color="red darken-4" dark>
        <v-card-title class="title">Confirm delete faculty</v-card-title>
        <v-card-text>Are you sure you want to delete {{ viewDeleteFacultyDialogContent.name }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" light outline @click="viewDeleteFacultyDialog = false">NO</v-btn>
          <v-btn
            color="white"
            light
            flat
            @click="viewDeleteFacultyDialog = false; deleteFaculty(viewDeleteFacultyDialogContent.id)"
          >YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewEditFacultyDialog" scrollable max-width="700px">
      <v-card>
        <v-card-title class="title">Edit details for {{ this.viewEditFacultyDialogContent.name }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>Name</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field :value="this.viewEditFacultyDialogContent.name" id="name"></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title>Username</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field :value="this.viewEditFacultyDialogContent.username" id="username"></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title>Password</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field
                  :value="this.viewEditFacultyDialogContent.password"
                  persistent-hint
                  hint="Enter a new password here to replace the current one"
                  id="password"
                ></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light outline @click="viewEditFacultyDialog = false">CANCEL</v-btn>
          <v-btn light flat @click="viewEditFacultyDialog = false; editFaculty()">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" timeout="3000">Successfully updated database.
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
      viewEditFacultyDialog: false,
      viewEditFacultyDialogContent: {},
      viewDeleteFacultyDialog: false,
      viewDeleteFacultyDialogContent: [],
      headers: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Username",
          value: "username"
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false
        },
        {
          text: "Edit",
          sortable: false
        }
      ],
      viewFaculties: []
    };
  },
  mounted() {
    console.log(this.viewFaculties);
    this.adminId = JSON.parse(localStorage.session).id;
    this.$apollo.queries.viewFaculties.refetch();
  },
  methods: {
    showEditFacultyDialog(student) {
      this.viewEditFacultyDialog = true;
      this.viewEditFacultyDialogContent = student;
    },
    editFaculty() {
      this.viewEditFacultyDialogContent.name = document.querySelector(
        "#name"
      ).value;
      this.viewEditFacultyDialogContent.username = document.querySelector(
        "#username"
      ).value;
      this.viewEditFacultyDialogContent.password = document.querySelector(
        "#password"
      ).value;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation EditFaculty(
              $adminId: String!
              $facultyId: String!
              $password: String
              $username: String
              $name: String
            ) {
              editFaculty(
                adminId: $adminId
                facultyId: $facultyId
                password: $password
                username: $username
                name: $name
              ) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            facultyId: this.viewEditFacultyDialogContent.id,
            adminId: this.adminId,
            password: this.viewEditFacultyDialogContent.password,
            username: this.viewEditFacultyDialogContent.username,
            name: this.viewEditFacultyDialogContent.name
          }
        })
        .then(response => {
          console.log("SENT THESE SERVERS", this.viewEditFacultyDialogContent);
          console.log("RESPONSE FROM EDIT", response);
          if (response.data.editFaculty.errors) {
            alert(
              "An error occurred: " +
                response.data.editFaculty.errors[0].message
            );
            return;
          }
          this.viewEditFacultyDialog = false;
          this.snackbar = true;
          this.$apollo.queries.viewFaculties.refetch();
        })
        .catch(err => {
          alert(err);
        });
    },
    showDeleteFacultyDialog(faculty) {
      this.viewDeleteFacultyDialogContent = faculty;
      this.viewDeleteFacultyDialog = true;
    },
    deleteFaculty(inputFacultyId) {
      console.log("Deleted " + inputFacultyId);
      console.log("Admin Id" + this.adminId);
      this.$apollo
        .mutate({
          mutation: gql`
            mutation DeleteFaculty($facultyId: String!, $adminId: String!) {
              deleteFaculty(facultyId: $facultyId, adminId: $adminId) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            facultyId: inputFacultyId,
            adminId: this.adminId
          }
        })
        .then(response => {
          this.snackbar = true;
          console.log("RESPONSE FROM DELETE");
          console.log(response);
          this.$apollo.queries.viewFaculties.refetch();
        })
        .catch(err => {
          alert(err);
        });
    }
  },
  apollo: {
    viewFaculties: gql`
      query ViewFaculties {
        viewFaculties {
          id
          name
          username
        }
      }
    `
  }
};
</script>

<style>
</style>
