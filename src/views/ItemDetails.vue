<template>
    <v-container fluid class="py-10">
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <v-card elevation="2">
            <v-img :src="item.image" height="400px" class="white--text" />
            <v-card-title class="display-1">{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.description }}</v-card-subtitle>
            <v-card-text>
              <p><strong>Details:</strong> {{ item.details }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="$router.push({ name: 'CultureInventory' })">
                Back to Inventory
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
        item: {},
      };
    },
    created() {
      const itemId = this.$route.params.id;
      // Fetch the item details based on the ID (you can replace this with actual data fetching logic)
      this.fetchItemDetails(itemId);
    },
    methods: {
      fetchItemDetails(itemId) {
        // Example items array to simulate data fetching
        const items = [
          {
            id: 1,
            name: "Traditional Filipino Barong",
            description: "Elegant hand-woven attire symbolizing Filipino heritage.",
            details: "Worn during formal occasions.",
            availability: "Available.",
            image: require('@/assets/TraditionalBarong.jpg'),
          },
          {
            id: 2,
            name: "Igorot Costume",
            description: "An Igorot costume features vibrant woven fabrics, often with traditional patterns, and may include a headdress, a sleeveless top or wrap skirt for women, and a loincloth or shorts for men.",
            details: "Worn during cultural ceremonies and festivals.",
            image: require('@/assets/Igorot.jpg'),
          },

          {
            id: 3,
            name: "Modern Filipiniana Gown",
            description: "The modern Filipiniana costume is a contemporary interpretation of traditional Filipino women's attire, symbolizing Filipino identity and cultural heritage. This style celebrates traditional elements while incorporating modern fashion trends, making it suitable for various occasions. Common features include the Maria Clara dress, which often uses vibrant fabrics and intricate designs that reflect Filipino artistry.",
            details: "Designed for formal occasions, it incorporates modern fabrics and embellishments while honoring Filipino heritage.",
            image: require('@/assets/Igorot.jpg'),
          },

          {
            id: 4,
            name: "Tutup",
            description: "The term TUTUP refers to an occupational folk dance from Laminusa, Sulu that is performed by the Tausug people, celebrating their craft of making colorful food covers also called tutup. Costumes for this dance often reflect traditional attire and may incorporate cultural motifs and vibrant colors that represent the Tausug heritage.",
            details: "Worn during cultural events and celebrations, it includes a long skirt for women and intricately designed shirts for men, often adorned with gold accents.",
            image: require('@/assets/Igorot.jpg'),
          },

          {
            id: 5,
            name: "Kadal-Tahu",
            description: "The Kadal Tahu costume typically includes a layered bead necklace and headdress, a batik-made blouse, and a malong used as a skirt. These elements reflect traditional attire that combines cultural significance with aesthetic appeal.",
            details: "Characterized by bold colors and intricate patterns, it is made from woven materials and adorned with elaborate accessories, typically worn during festivals and cultural celebrations.",
            image: require('@/assets/Igorot.jpg'),
          },

          {
            id: 6,
            name: "Linggisan",
            description: "Linggisan refers to both a traditional Tausug dance that mimics the movements of an eagle and an animal common in the region—a local seagull seen by the Sama, Bajao, and Tausug people in the Sulu Archipelago. The dance is characterized by steps that imitate the flight and the predatory behaviors of an eagle.",
            details: "Worn during rituals and community gatherings, featuring a wrap-around skirt for women and a loincloth for men, complemented by handmade accessories.",
            image: require('@/assets/Igorot.jpg'),
          },

          {
            id: 7,
            name: "Igorot Costume",
            description: "An Igorot costume features vibrant woven fabrics, often with traditional patterns, and may include a headdress, a sleeveless top or wrap skirt for women, and a loincloth or shorts for men.",
            details: "Worn during cultural ceremonies and festivals.",
            image: require('@/assets/Igorot.jpg'),
          },

          {
            id: 8,
            name: "Igorot Costume",
            description: "An Igorot costume features vibrant woven fabrics, often with traditional patterns, and may include a headdress, a sleeveless top or wrap skirt for women, and a loincloth or shorts for men.",
            details: "Worn during cultural ceremonies and festivals.",
            image: require('@/assets/Igorot.jpg'),
          },

        ];
  
        // Find the item by ID
        this.item = items.find(item => item.id === Number(itemId));
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    border-radius: 15px;
  }

  .v-card-subtitle{
    white-space: normal;
    word-break: break-word;
  }
  </style>
  