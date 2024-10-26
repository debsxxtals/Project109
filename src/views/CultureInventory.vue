<template>
    <v-container fluid class="py-10 culture-inventory-container">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold text-center text-white">
            Culture Inventory
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
            <v-img :src="item.image" height="200px"></v-img>
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
            image: "path-to-image/barong.jpg",
          },
          {
            id: 2,
            name: "Igorot Warrior Garb",
            description: "Traditional warrior attire worn by the Igorot tribes.",
            image: "path-to-image/igorot.jpg",
          },
          // Add more items as needed
        ],
      };
    },
    methods: {
      viewDetails(itemId) {
        // Logic to handle viewing item details
        // Redirect to an item details page or open a modal
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
  </style>
  