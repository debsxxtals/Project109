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
              class="text-uppercase mb-3 mb-sm-0 mx-sm-1"
              @click="scrollToSection('get-started')"
              large
            >
              Get Started
            </v-btn>

            <v-btn
              append-icon="mdi-arrow-right"
              class="text-none text-uppercase mb-3 mb-sm-0 mx-sm-1"
              large
              text="Learn more"
              variant="text"
              @click="scrollToSection('explore-collections')"
            />
          </v-container>
        </v-container>
      </v-col>

      <!-- Second Column: Image -->
      <v-col cols="12" sm="6">
        <v-responsive class="px-0">
          <v-img
            src="../assets/cul 1.jpg"
            alt="Culture Image"
            contain
            max-height="400"
          ></v-img>
        </v-responsive>
      </v-col>
    </v-row>
  </v-container>

  <!-- Bottom Screen Section (Target Section) -->
  <v-container
    fluid
    id="explore-collections"
    class="pa-12"
    style="min-height: 100vh"
  >
    <v-row>
      <v-col cols="12" class="text-center text-black">
        <h2 class="display-2">Explore Our Collections</h2>
        <p class="subheading">
          Dive into the world of traditional costumes, dances, and stories that
          reflect the richness of our heritage.
        </p>
      </v-col>
    </v-row>
    <v-container class="mt-5">
      <v-row>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            variant="tonal"
            class="mx-auto"
            color="surface-variant"
            max-width="344"
            max-height="500"
            elevation="1"
          >
            <v-img
              color="surface-variant"
              height="200"
              src="../assets/pic1.jpg"
              cover
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            variant="tonal"
            class="mx-auto"
            color="surface-variant"
            max-width="344"
            max-height="500"
            elevation="1"
          >
            <v-img
              color="surface-variant"
              height="200"
              src="../assets/pic2.jpg"
              cover
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            variant="tonal"
            class="mx-auto"
            color="surface-variant"
            max-width="344"
            max-height="500"
            elevation="1"
          >
            <v-img
              color="surface-variant"
              height="200"
              src="../assets/pic3.jpg"
              cover
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            variant="tonal"
            class="mx-auto"
            color="surface-variant"
            max-width="344"
            max-height="500"
            elevation="1"
          >
            <v-img
              color="surface-variant"
              height="200"
              src="../assets/pic4.jpg"
              cover
            ></v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>

  <v-container id="get-started">
    <Login />
  </v-container>
</template>

<style scoped>
.v-application {
  background-color: #08544f !important;
}

.typewriter {
  border-right: 2px solid #d7b43d;
  white-space: nowrap;
  overflow: auto;
}

#explore-collections {
  background-color: #ffffff;
  min-height: 100vh;
}
</style>

<script>
import Login from "../components/AuthenticationForms.vue";

export default {
  name: "LandingPage",
  data() {
    return {
      fullText: "Culture Closet!",
      typewriterText: "",
      typeSpeed: 100, // Speed of typing
      deleteSpeed: 50, // Speed of deleting text
      pauseDuration: 2000, // Time before restarting typing
    };
  },
  mounted() {
    this.startTypewriter();
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    startTypewriter() {
      let index = 0;
      let isDeleting = false;

      const typeEffect = () => {
        if (!isDeleting && index < this.fullText.length) {
          // Type the text
          this.typewriterText += this.fullText.charAt(index);
          index++;
          setTimeout(typeEffect, this.typeSpeed);
        } else if (isDeleting && index >= 0) {
          // Delete the text
          this.typewriterText = this.fullText.substring(0, index);
          index--;
          setTimeout(typeEffect, this.deleteSpeed);
        } else if (!isDeleting && index === this.fullText.length) {
          // Pause at the end of typing before deleting
          setTimeout(() => {
            isDeleting = true;
            setTimeout(typeEffect, this.deleteSpeed);
          }, this.pauseDuration);
        } else if (isDeleting && index === -1) {
          // Start typing again
          isDeleting = false;
          index = 0;
          setTimeout(typeEffect, this.typeSpeed);
        }
      };

      typeEffect();
    },
  },
  components: {
    Login,
  },
};
</script>
