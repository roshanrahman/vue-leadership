<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card-text>
          <h1 class="display-2 font-weight-light">Welcome to CS Entry</h1>
          <br>
          <!-- <div>
            <v-card dark color="blue">
              <v-card-title class="title">Using mobile?</v-card-title>
              <v-card-text>If you are using this site on your Android, we recommend that you use the Android app for the best mobile experience. Touch this card to download the app.</v-card-text>
            </v-card>
            <br>
          </div>-->
          <p
            style="color: teal"
            class="title"
          >Use the navigation panel on the left to view actions available to you.</p>
          <v-divider></v-divider>
          <br>
          <div v-if="isAdmin">
            <p
              class="title"
            >As administrator, you can add, view and delete student, course, faculty data from database.</p>
            <p>You can also view and download all the Leadership Board entries submitted by faculty.</p>
            <p>
              If you'd like to
              <i>add</i> leadership board entries, please use your faculty account.
            </p>
          </div>
          <div v-if="!isAdmin">
            <p
              class="title"
            >CS Entry is designed to allow you to store Leadership Board mark entries for your students.</p>
            <p>You can easily add, delete, view and download the entries you make, and generate Star Of The Week report automatically for your class.</p>
            <p>
              <strong>
                We recommend you use CS Entry's Android app on your mobile device. You can download it
                <a
                  href="https://drive.google.com/open?id=161uw2XTEcpq-U7fF33_ke8jkZjbL4UaP"
                >here.</a>
              </strong>
            </p>
            <p>Contact the administrator in case of incorrect student, faculty or course data.</p>
          </div>
          <br>
          <p class="body-2">
            You can mail us your feedback
            <a href="mailto:mjolnirssvr@gmail.com">here</a>.
          </p>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  mounted() {
    if (JSON.parse(localStorage.session).isAdmin === true) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  },
  data() {
    return {
      isAdmin: false
    };
  }
};
</script>

<style>
</style>
