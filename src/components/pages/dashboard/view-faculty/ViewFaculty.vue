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
            <v-data-table :search="search" hide-actions :headers="headers" :items="viewFaculties">
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
    <v-snackbar v-model="snackbar" timeout="3000">Successfully deleted faculty.
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
