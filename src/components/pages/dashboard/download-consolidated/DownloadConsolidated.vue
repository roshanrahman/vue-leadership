<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline">Consolidated Marksheet</h3>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-card-text>
            <p
              class="title"
            >Enter the following details to download consolidated marksheet for any class</p>

            <v-menu
              v-model="showStartDate"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="startDate"
                label="Starting date"
                hint="Enter the date to start the range"
                persistent-hint
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="startDate" @input="showStartDate = false"></v-date-picker>
            </v-menu>
            <br>
            <v-menu
              v-model="showEndDate"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <br>
              <v-text-field
                slot="activator"
                v-model="endDate"
                label="Ending date"
                hint="Enter the date to mark the end of the range"
                persistent-hint
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="endDate" @input="showEndDate = false"></v-date-picker>
            </v-menu>
            <br>
            <v-select
              v-model.number="regulation"
              :items="[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]"
              label="Batch"
              solo
            ></v-select>
            <v-select v-model="section" :items="['A', 'B', 'C']" label="Section" solo></v-select>
            <v-btn color="primary" :loading="loading" @click="onDownloadClicked">
              <v-icon style="padding-right:8px;">cloud_download</v-icon>Download Marksheet CSV
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-snackbar v-model="snackbar" timeout="3000">Downloaded. Check your downloads.
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
      adminId: "",
      loading: false,
      startDate: "",
      endDate: "",
      regulation: "",
      section: "",
      showStartDate: false,
      showEndDate: false,
      getConsolidateMarks: null,
      snackbar: false
    };
  },
  mounted() {
    console.log("Mounted");
    console.log(this.viewRecords);
    this.session = JSON.parse(localStorage.session);
    this.adminId = JSON.parse(localStorage.session).id;
    console.log("USER ID" + this.adminId);
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
      this.loading = false;
    },
    onDownloadClicked() {
      this.loading = true;
      console.log(this.getConsolidateMarks);
      this.download("marksheet.csv", this.getConsolidateMarks);
      this.snackbar = true;
    }
  },
  apollo: {
    getConsolidateMarks: {
      query: gql`
        query GetConsolidateMarks(
          $startDate: String!
          $endDate: String!
          $year: Int!
          $section: String!
        ) {
          getConsolidateMarks(
            startDate: $startDate
            endDate: $endDate
            year: $year
            section: $section
          )
        }
      `,
      variables() {
        return {
          startDate: this.startDate,
          endDate: this.endDate,
          year: this.regulation,
          section: this.section
        };
      }
    }
  }
};
</script>

<style>
</style>
