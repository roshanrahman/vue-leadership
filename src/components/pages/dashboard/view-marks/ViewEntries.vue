<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">View Mark Entries</h3>
            <v-spacer></v-spacer>

            <v-btn flat color="primary" @click="onDownloadClicked">
              <v-icon style="padding-right:5px;">save</v-icon>Download as Excel CSV
            </v-btn>

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
            <v-data-table :search="search" hide-actions :headers="headers" :items="filteredRecords">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.date }}</td>
                <td>{{ props.item.course.coursecode }}</td>
                <td>{{ props.item.course.coursename }}</td>
                <td>{{ props.item.student.registerno }}</td>
                <td>{{ props.item.student.name }}</td>
                <td>{{ props.item.points }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="viewDeleteRecordDialog" scrollable max-width="300px">
      <v-card color="red darken-4" dark>
        <v-card-title class="title">Confirm delete record</v-card-title>
        <v-card-text>Are you sure you want to delete this record?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" light outline @click="viewDeleteRecordDialog = false">NO</v-btn>
          <v-btn
            color="white"
            light
            flat
            @click="viewDeleteRecordDialog = false; deleteRecord(viewDeleteRecordDialogContent.id)"
          >YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" timeout="3000">Successfully deleted Record.
      <v-btn color="teal" flat @click="snackbar = false">Got it</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
export default {
  computed: {
    filteredRecords() {
      const recordList = this.viewRecords.records.filter(
        record => record.faculty.id === this.adminId
      );
      return recordList;
    }
  },
  data() {
    return {
      search: null,
      adminId: null,
      snackbar: false,
      viewDeleteRecordDialog: false,
      viewDeleteRecordDialogContent: [],
      headers: [
        {
          text: "Date",
          value: "date"
        },
        {
          text: "Course Code",
          value: "course.coursecode"
        },
        {
          text: "Course Name",
          value: "course.coursename"
        },
        {
          text: "Student Register No.",
          value: "student.registerno"
        },
        {
          text: "Student Name",
          value: "student.name"
        },
        {
          text: "Marks awarded",
          value: "points"
        }
      ],
      viewRecords: [],
      viewRecordsCSV: ""
    };
  },
  mounted() {
    console.log(this.viewRecords);
    this.adminId = JSON.parse(localStorage.session).id;
    this.$apollo.queries.viewRecords.refetch();
  },
  methods: {
    download(filename, text) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    onDownloadClicked() {
      this.download("leadership-entries.csv", this.viewRecordsCSV);
    },
    showDeleteRecordDialog(Record) {
      this.viewDeleteRecordDialogContent = Record;
      this.viewDeleteRecordDialog = true;
    },
    deleteRecord(inputRecordId) {
      console.log("Deleted " + inputRecordId);
      console.log("Admin Id" + this.adminId);
      this.$apollo
        .mutate({
          mutation: gql`
            mutation DeleteRecord($recordId: String!, $adminId: String!) {
              deleteRecord(recordId: $recordId, adminId: $adminId) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            recordId: inputRecordId,
            adminId: this.adminId
          }
        })
        .then(response => {
          this.snackbar = true;
          console.log("RESPONSE FROM DELETE");
          console.log(response);
          this.$apollo.queries.viewRecords.refetch();
        })
        .catch(err => {
          alert(err);
        });
    }
  },
  apollo: {
    viewRecords: gql`
      query ViewRecords {
        viewRecords {
          records {
            student {
              name
              registerno
            }
            faculty {
              name
              id
            }
            course {
              coursecode
              coursename
            }
            points
            date
          }
        }
      }
    `,
    viewRecordsCSV: {
      query: gql`
        query ViewRecords($csv: Boolean) {
          viewRecords(csv: $csv) {
            csv
          }
        }
      `,
      variables: {
        csv: true
      }
    }
  }
};
</script>

<style>
</style>
