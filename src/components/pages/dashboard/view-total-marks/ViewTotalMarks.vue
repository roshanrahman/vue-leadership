<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">View total marks scored so far</h3>
            <v-spacer></v-spacer>

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
              class="elevation-1"
              :search="search"
              hide-actions
              :loading="!getStudentTotalMarks[0]"
              :headers="headers"
              :items="getStudentTotalMarks"
            >
              <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

              <template slot="items" slot-scope="props">
                <td>{{ props.item.registerno }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.dob }}</td>
                <td>{{ props.item.year }}</td>
                <td>{{ props.item.section }}</td>
                <td
                  class="font-weight-medium subheading"
                >{{ props.item.totalMarks ? props.item.totalMarks.totalMarks : 0 }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
export default {
  computed: {},
  data() {
    return {
      search: null,
      adminId: "",
      snackbar: false,
      session: {},
      getStudentTotalMarks: [],
      viewDeleteRecordDialog: false,
      viewDeleteRecordDialogContent: [],
      headers: [
        {
          text: "Register No.",
          value: "registerno"
        },
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Date of Birth",
          value: "dob"
        },
        {
          text: "Batch",
          value: "year"
        },
        {
          text: "Section",
          value: "section"
        },
        {
          text: "Total marks scored",
          value: "totalMarks.totalMarks"
        }
      ],
      viewRecords: { records: [] },
      viewRecordsCSV: ""
    };
  },
  mounted() {
    console.log("Mounted");
    console.log(this.viewRecords);
    this.session = JSON.parse(localStorage.session);
    this.adminId = JSON.parse(localStorage.session).id;
    console.log("USER ID" + this.adminId);
    this.$apollo.queries.viewRecords.refetch();
  },
  methods: {
    onDownloadClicked() {
      console.log("GET RECORDS", this.getStudentTotalMarks);
    }
  },
  apollo: {
    getStudentTotalMarks: gql`
      query GetStudentTotalMarks {
        getStudentTotalMarks {
          id
          registerno
          name
          dob
          year
          section
          totalMarks {
            totalMarks
          }
        }
      }
    `
  }
};
</script>

<style>
</style>
