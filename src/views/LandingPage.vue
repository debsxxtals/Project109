<template>
  <v-app>
    <!-- Transparent Navbar -->

    <!-- Full Screen Landing Section -->
    <v-container fluid class="py-4 px-50 pt-10">
      <v-row>
        <!-- First Column: Text and Button -->
        <v-col
          cols="12"
          sm="6"
          class="d-flex flex-column justify-center align-center"
        >
          <v-container class="text-sm-start text-center ml-0 ml-lg-16">
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
        <v-col cols="12" sm="6" class="image-column pt-0 mt-0">
          <v-responsive class="image-container ms-5 mt-0">
            <v-img
              src="../assets/culture.gif"
              alt="Culture Image"
              contain
              max-height="510"
              max-width="900"
              class="rounded-image"
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
            Dive into the world of traditional costumes, dances, and stories
            that reflect the richness of our heritage.
          </p>
        </v-col>
      </v-row>

      <v-container class="mt-5">
        <v-row>
          <v-col cols="12" sm="6" md="3" lg="3">
            <v-card
              variant="tonal"
              class="mx-auto image-card"
              color="surface-variant"
              max-width="344"
              max-height="500"
              elevation="1"
              @click="openImageModal('../assets/pic1.jpg')"
            >
              <v-img
                color="surface-variant"
                height="200"
                src="../assets/pic1.jpg"
                cover
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3" lg="3">
            <v-card
              variant="tonal"
              class="mx-auto image-card"
              color="surface-variant"
              max-width="344"
              max-height="500"
              elevation="1"
              @click="openImageModal('../assets/pic2.jpg')"
            >
              <v-img
                color="surface-variant"
                height="200"
                src="../assets/pic2.jpg"
                cover
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3" lg="3">
            <v-card
              variant="tonal"
              class="mx-auto image-card"
              color="surface-variant"
              max-width="344"
              max-height="500"
              elevation="1"
              @click="openImageModal('../assets/tausug.jpg')"
            >
              <v-img
                color="surface-variant"
                height="200"
                src="../assets/tausug.jpg"
                cover
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3" lg="3">
            <v-card
              variant="tonal"
              class="mx-auto image-card"
              color="surface-variant"
              max-width="344"
              max-height="500"
              elevation="1"
              @click="openImageModal('../assets/pic4.jpg')"
            >
              <v-img
                color="surface-variant"
                height="200"
                src="../assets/pic4.jpg"
                cover
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Modal for Image Pop-up -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-img
        :src="selectedImage"
        alt="Selected Image"
        max-height="600px"
        contain
      />
    </v-dialog>

    <!-- Authentication Form Section -->
    <v-container id="get-started">
      <Login />
    </v-container>
  </v-app>
</template>

<script>
import Login from "../components/AuthenticationForms.vue";

export default {
  name: "LandingPage",
  data() {
    return {
      dialog: false, // Controls the modal visibility
      selectedImage: "", // Stores the image source to display in modal
      fullText: "Culture Closet!",
      typewriterText: "",
      typeSpeed: 100, // Speed of typing
      deleteSpeed: 50, // Speed of deleting text
      pauseDuration: 2000, // Time before restarting typing
    };
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
          this.typewriterText += this.fullText.charAt(index);
          index++;
          setTimeout(typeEffect, this.typeSpeed);
        } else if (isDeleting && index >= 0) {
          this.typewriterText = this.fullText.substring(0, index);
          index--;
          setTimeout(typeEffect, this.deleteSpeed);
        } else if (!isDeleting && index === this.fullText.length) {
          setTimeout(() => {
            isDeleting = true;
            setTimeout(typeEffect, this.deleteSpeed);
          }, this.pauseDuration);
        } else if (isDeleting && index === -1) {
          isDeleting = false;
          index = 0;
          setTimeout(typeEffect, this.typeSpeed);
        }
      };

      typeEffect();
    },
    openImageModal(imageSrc) {
      this.selectedImage = imageSrc;
      this.dialog = true; // Show the modal
    },
  },
  components: {
    Login,
  },
};
</script>

<style scoped>
.image-column {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 50px; /* Added some space for the header */
}

.image-container:hover::before {
  background: rgba(0, 0, 0, 0.5); /* Darker overlay on hover */
}

@media (max-width: 600px) {
  .image-column {
    margin-top: 20px; /* Reduced space on small screens */
  }
}

.v-application {
  background-color: #08544f !important;
}

#explore-collections {
  background-color: #ffffff;
  min-height: 100vh;
}

.fixed-top {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}

.pt-20 {
  padding-top: 0px; /* Adjust this value based on navbar height */
}

.image-card:hover .v-img {
  transform: scale(1.1); /* Slightly scale up the image */
  transition: transform 0.3s ease;
}

.v-dialog .v-img {
  display: block;
  margin: auto;
}
</style>
