<template>
  <v-container fluid class="py-15 px-5 homepage-container">
    <v-row>
      <!-- Text and Button Column -->
      <v-col
        cols="12"
        sm="6"
        class="d-flex flex-column justify-center align-center"
      >
        <v-container class="text-sm-start text-center ml-0 ml-lg-16">
          <h1
            class="display-1 text-white text-h4 text-md-h3 text-lg-h2 font-weight-bold"
          >
            Welcome to Culture Closet
          </h1>
          <p class="subheading mb-4 mt-1 text-white">
            Discover authentic cultural attire and the stories they tell.
          </p>
          <v-btn
            color="primary"
            large
            class="mx-sm-1"
            @click="exploreCollections"
          >
            Explore Collections
          </v-btn>
        </v-container>
      </v-col>

      <!-- Image Column -->
      <v-col cols="12" sm="6">
        <v-responsive class="px-0">
          <v-img
            src="your-image-path.jpg"
            alt="Culture Home Image"
            contain
            max-height="400"
          ></v-img>
        </v-responsive>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    exploreCollections() {
      this.$router.push({ name: 'CultureInventory' }); // Redirect to CultureInventory page
    },
  },
};
</script>

<style scoped>
.homepage-container {
  background-image: url("");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  color: white;
}

.subheading {
  font-size: 1.2rem;
}

.v-btn {
  font-weight: bold;
}
</style>
