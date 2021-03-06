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
            <v-data-table
              :loading="!viewStudents[0]"
              :search="search"
              hide-actions
              class="elevation-1"
              :headers="headers"
              :items="viewStudents"
            >
              <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

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
                <td>
                  <v-icon
                    title="Upload image"
                    flat
                    color="grey"
                    @click="showImageDialog(props.item)"
                  >add_a_photo</v-icon>
                </td>
                <td>
                  <v-icon
                    title="Edit details"
                    flat
                    color="grey"
                    @click="showEditStudentDialog(props.item)"
                  >edit</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Image Dialog -->
    <v-dialog v-model="viewImageDialog" scrollable max-width="600px">
      <v-card>
        <v-card-title
          class="title"
        >Image for student {{ viewImageDialogContent.name }} ({{ viewImageDialogContent.registerno}})</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <img :src="viewImageDialogContent.image" height="150" v-if="viewImageDialogContent.image">
        </v-card-text>
        <v-card-text v-if="!viewImageDialogContent.image">No image was previously uploaded</v-card-text>
        <v-card-text v-if="viewImageDialogContent.changes">
          <b>This is just a preview of selected image. Upload image to save.</b>
        </v-card-text>
        <v-card-text>
          <v-text-field
            label="Select Image"
            @click="pickFile"
            v-model="imageName"
            prepend-icon="attach_file"
          ></v-text-field>
          <v-btn @click="uploadImage" color="primary">Upload selected image</v-btn>
        </v-card-text>

        <input
          type="file"
          style="display: none"
          ref="image"
          accept="image/*"
          @change="onFilePicked"
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            light
            outline
            @click="viewImageDialog = false; viewImageDialogContent.changes=false;"
          >Discard Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete dialog -->
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
    <v-dialog v-model="viewEditStudentDialog" scrollable max-width="700px">
      <v-card>
        <v-card-title class="title">Edit details for {{ this.viewEditStudentDialogContent.name }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>Register No.</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field :value="this.viewEditStudentDialogContent.registerno" id="registerno"></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title>Name</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field :value="this.viewEditStudentDialogContent.name" id="name"></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title>DOB</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field :value="this.viewEditStudentDialogContent.dob" id="dob"></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title>Year/Regulation</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field :value="this.viewEditStudentDialogContent.year" id="year"></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title>Section</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-text-field :value="this.viewEditStudentDialogContent.section" id="section"></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light outline @click="viewEditStudentDialog = false">CANCEL</v-btn>
          <v-btn light flat @click="viewEditStudentDialog = false; editStudent()">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" timeout="3000">Successfully saved changes to database.
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
      viewImageDialog: false,
      viewEditStudentDialog: false,
      viewEditStudentDialogContent: {},
      viewDeleteStudentDialogContent: [],
      viewImageDialogContent: [],
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
        },
        {
          text: "Photo",
          value: "photo",
          sortable: false
        },
        {
          text: "Edit",
          value: "edit",
          sortable: false
        }
      ],
      viewStudents: [],
      getStudentImage: ""
    };
  },
  mounted() {
    console.log(this.viewStudents);
    this.adminId = JSON.parse(localStorage.session).id;
    this.$apollo.queries.viewStudents.refetch();
  },
  methods: {
    showEditStudentDialog(student) {
      this.viewEditStudentDialog = true;
      this.viewEditStudentDialogContent = student;
    },
    editStudent() {
      this.viewEditStudentDialogContent.registerno = document.querySelector(
        "#registerno"
      ).value;
      this.viewEditStudentDialogContent.name = document.querySelector(
        "#name"
      ).value;
      this.viewEditStudentDialogContent.dob = document.querySelector(
        "#dob"
      ).value;
      this.viewEditStudentDialogContent.year = Number(
        document.querySelector("#year").value
      );
      this.viewEditStudentDialogContent.section = document.querySelector(
        "#section"
      ).value;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation EditStudent(
              $adminId: String!
              $studentId: String!
              $registerno: String
              $name: String
              $dob: String
              $year: Int
              $section: String
            ) {
              editStudent(
                adminId: $adminId
                studentId: $studentId
                registerno: $registerno
                name: $name
                dob: $dob
                year: $year
                section: $section
              ) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            studentId: this.viewEditStudentDialogContent.id,
            adminId: this.adminId,
            registerno: this.viewEditStudentDialogContent.registerno,
            name: this.viewEditStudentDialogContent.name,
            dob: this.viewEditStudentDialogContent.dob,
            year: this.viewEditStudentDialogContent.year,
            section: this.viewEditStudentDialogContent.section
          }
        })
        .then(response => {
          console.log("SENT THESE SERVERS", this.viewEditStudentDialogContent);
          console.log("RESPONSE FROM EDIT", response);
          if (response.data.editStudent.errors) {
            alert(
              "An error occurred: " +
                response.data.editStudent.errors[0].message
            );
            return;
          }
          this.viewEditStudentDialog = false;
          this.snackbar = true;
          this.$apollo.queries.viewStudents.refetch();
        })
        .catch(err => {
          alert(err);
        });
    },
    resizedataURL(datas, wantedWidth, wantedHeight) {
      return new Promise(async function(resolve, reject) {
        // We create an image to receive the Data URI
        var img = document.createElement("img");

        // When the event "onload" is triggered we can resize the image.
        img.onload = function() {
          // We create a canvas and get its context.
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");

          // We set the dimensions at the wanted size.
          canvas.width = wantedWidth;
          canvas.height = wantedHeight;

          // We resize the image with the canvas method drawImage();
          ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

          var dataURI = canvas.toDataURL();

          // This is the return of the Promise
          resolve(dataURI);
        };

        // We put the Data URI in the image's src attribute
        img.src = datas;
      });
    },
    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.viewImageDialogContent.imageName = files[0].name;
        if (this.viewImageDialogContent.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.viewImageDialogContent.image = fr.result;
          this.viewImageDialogContent.changes = true;
          console.log("Image", this.viewImageDialogContent);
          this.viewImageDialogContent.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.viewImageDialogContent.imageName = "";
        this.viewImageDialogContent.imageFile = "";
        this.viewImageDialogContent.image = "";
        this.viewImageDialogContent.changes = false;
      }
    },
    showDeleteStudentDialog(Student) {
      this.viewDeleteStudentDialogContent = Student;
      this.viewDeleteStudentDialog = true;
    },
    showImageDialog(Student) {
      this.currentStudentId = Student.id;
      this.viewImageDialogContent = Student;
      this.viewImageDialogContent.image = this.getStudentImage;
      console.log("Get image", this.getStudentImage);
      this.$apollo.queries.getStudentImage.refetch();
      this.viewImageDialog = true;
    },
    uploadImage() {
      console.log(this.viewImageDialogContent);
      this.$apollo
        .mutate({
          mutation: gql`
            mutation AddStudentImage(
              $adminId: String!
              $studentId: String!
              $image: String!
            ) {
              addStudentImage(
                adminId: $adminId
                studentId: $studentId
                image: $image
              ) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            studentId: this.viewImageDialogContent.id,
            adminId: this.adminId,
            image: this.viewImageDialogContent.image
          }
        })
        .then(response => {
          console.log("RESPONSE FROM ADD IMAGE");
          console.log(response);
          if (response.data.addStudentImage.errors) {
            alert(
              "An error occurred: " +
                response.data.addStudentImage.errors[0].message
            );
            return;
          }
          this.viewImageDialogContent.changes = false;
          this.viewImageDialog = false;
          this.snackbar = true;
          this.$apollo.queries.viewStudents.refetch();
        })
        .catch(err => {
          alert(err);
        });
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
    `,
    getStudentImage: {
      query: gql`
        query GetStudentImage($studentId: String!) {
          getStudentImage(studentId: $studentId)
        }
      `,
      variables() {
        console.log("from query variable", this.currentStudentId);

        return {
          studentId: this.currentStudentId
        };
      }
    }
  }
};
</script>

<style>
</style>
