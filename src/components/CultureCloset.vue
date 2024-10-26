<template>
 <!-- Full Screen Landing Section -->
    <v-container fluid class="py-15 px-5">
      <v-row>
        <!-- First Column: Text and Button -->
        <v-col
          cols="12"
          sm="6"
          class="d-flex flex-column justify-center align-center"
        >
          <!-- Column1 -->
          <v-container class="text-sm-start text-center ml-0 ml-lg-16">
            <!-- Typewriter Animation -->
            <h1
              class="display-1 text-white text-h4 text-md-h3 text-lg-h2 font-weight-bold"
            >
              Culture Closet
            </h1>
            <p class="subheading mb-4 mt-1 text-white">
              Discover the rich culture, traditional dances, and stories of our
              heritage.
            </p>
            <v-container
              class="d-flex flex-column flex-sm-row justify-center justify-sm-start"
            >
              <v-btn
                color="primary"
                large
                class="mb-3 mb-sm-0 mx-sm-1"
                @click="scrollToSection('get-started')"
              >
                Get Started
              </v-btn>
              <v-btn
                color="secondary"
                large
                class="mb-3 mb-sm-0 mx-sm-1"
                @click="scrollToSection('explore-collections')"
              >
                Learn More
              </v-btn>
            </v-container>
          </v-container>
        </v-col>

        <!-- Second Column: Image -->
        <v-col cols="12" sm="6">
          <v-responsive class="px-0">
            <v-img
              src="../src/assets/cul 1.jpg"
              alt="Culture Image"
              contain
              max-height="400"
            ></v-img>
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
</template>

