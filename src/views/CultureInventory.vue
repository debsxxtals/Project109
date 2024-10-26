<template>
    <v-container fluid class="py-10 culture-inventory-container">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold text-center text-white">
            Culture Closet Inventory
          </h1>
          <p class="text-center text-white mb-8">
            Explore our collection of traditional costumes and cultural attire.
          </p>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col
          v-for="item in items"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="ma-3" elevation="3">
            <v-img 
              :src="item.image" 
              height="200px" 
              class="white--text"
              contain
            ></v-img>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.description }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="primary" @click="viewDetails(item.id)">
                View Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        items: [
          {
            id: 1,
            name: "Traditional Filipino Barong",
            description: "Elegant hand-woven attire symbolizing Filipino heritage.",
            image: require('@/assets/TraditionalBarong.jpg'),
          },
          {
            id: 2,
            name: "Igorot Costume",
            description: "Traditional attire of the Igorot tribes, featuring vibrant woven textiles.",
            image: require('@/assets/Igorot.jpg'),
          },
          {
            id: 3,
            name: "Modern Filipiniana Gown",
            description: "Modern Filipiniana retains the grace and sophistication of traditional Filipiniana and incorporates Filipiniana into everyday clothing.",
            image: "dadsadsad",
          },

          {
            id: 4,
            name: "Tutup Costume",
            description: "Tutup is an occupational folk dance originating from Laminusa, Sulu.",
            image: "dadsadsad",
          },

          {
            id: 5,
            name: "Kadal-Tahu Costume",
            description: "Coming from Lake Sebu, South Cotabato, the Kadal Tahu is considered the 'True Dance of the T'Boli",
            image: "dadsadsad",
          },

          {
            id: 6,
            name: "Linggisan",
            description: "a traditional Tausug dance for females.",
            image: "dadsadsad",
          },

          {
            id: 7,
            name: "Modern Filipiniana Gown",
            description: "adsadasda",
            image: "dadsadsad",
          },

          {
            id: 8,
            name: "Modern Filipiniana Gown",
            description: "adsadasda",
            image: "dadsadsad",
          },
        ],
      };
    },
    methods: {
      viewDetails(itemId) {
        this.$router.push({ name: "ItemDetails", params: { id: itemId } });
      },
    },
  };
  </script>
  
  <style scoped>
  .culture-inventory-container {
    background-image: url(""); 
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    color: white;
  }
  
  .v-card {
    border-radius: 15px;
  }
  
  .v-img {
    width: 100%; /* Ensure image takes full width */
    height: auto; /* Maintain aspect ratio */
  }
  </style>
  