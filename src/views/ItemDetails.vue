<template>
  <v-container fluid>
    <v-card elevation="2" class="ma-sm-5">
      <v-row no-gutters>
        <!-- Left Column for Image and Title -->
        <v-col cols="12" sm="6" md="7">
          <v-card-item>
            <v-img
              :src="item.image"
              min-height="300px"
              max-height="400px"
              class="white--text"
            />
          </v-card-item>
        </v-col>

        <!-- Right Column for Item Details and Actions -->
        <v-col cols="12" sm="6" md="5">
          <v-card-title class="pb-0 mb-0 mt-5">{{ item.name }}</v-card-title>
          <v-card-subtitle class="pt-0 mt-0 mb-5">{{
            item.description
          }}</v-card-subtitle>
          <v-card-text class="text-subtitle-1 font-weight-medium">
            <v-row align="center">
              <v-col cols="5" sm="4" md="3">Category</v-col>
              <v-col cols="7" sm="8" md="9">
                <v-chip
                  class="ma-0 font-weight-medium ml-1"
                  color="amber"
                  text-color="black"
                  rounded
                  variant="flat"
                >
                  {{ item.tribe }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-subtitle class="text-subtitle-2 font-weight-medium">
            <v-row align="center">
              <v-col cols="5" sm="4" md="3">Availability</v-col>
              <v-col cols="7" sm="8" md="9">{{ item.counts }}</v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider class="ma-5"></v-divider>

          <v-card-text
            class="text-subtitle-1 font-weight-medium d-flex align-center"
          >
            <v-row align="center">
              <v-col cols="4" md="3">Quantity</v-col>
              <v-col cols="8" md="9" class="d-flex align-center">
                <!-- Minus button -->
                <v-btn
                  icon
                  @click="decreaseQuantity"
                  class="mx-2"
                  color="grey-lighten-3"
                  rounded="0"
                  size="x-small"
                  variant="flat"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>

                <!-- Display quantity in the middle -->
                <v-text-field
                  v-model="quantity"
                  class="mx-2 centered-text-field"
                  variant="plain"
                  density="comfortable"
                  type="text"
                  style="max-width: 20px; height: 50px"
                />

                <!-- Plus button -->
                <v-btn
                  icon
                  @click="increaseQuantity"
                  class="mx-2"
                  color="grey-lighten-3"
                  rounded="0"
                  size="x-small"
                  variant="flat"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text class="text-subtitle-1 font-weight-medium">
            <v-row align="center">
              <v-col cols="4" md="3">Size</v-col>
              <v-col
                cols="8"
                md="9"
                class="d-flex align-content-start flex-wrap"
              >
                <v-btn
                  v-for="size in sizes"
                  :key="size"
                  @click="selectedSize = size"
                  :class="{ 'selected-size': selectedSize === size }"
                  class="mx-1 mb-2"
                  color="amber"
                  variant="outlined"
                  small
                  :ripple="false"
                >
                  {{ size }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-row align="center" no-gutters class="my-5">
            <v-col cols="4" md="3"></v-col>
            <v-col cols="8" md="9" class="d-flex align-center">
              <v-btn
                color="amber"
                rounded="lg"
                :loading="loading"
                @click="load"
                class="px-4 py-5 py-sm-6 d-flex align-center justify-center"
              >
                Borrow Now
              </v-btn>

              <v-card-actions class="pa-0 ml-4 mr-4">
                <v-btn
                  icon
                  @click.stop="addToFavorites(item.id)"
                  variant="outlined"
                  rounded="lg"
                  size="small"
                >
                  <v-icon>mdi-heart-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-btn
              color="primary"
              @click="$router.push({ name: 'CultureInventory' })"
            >
              Back to Inventory
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      item: {}, // Current item details
      quantity: 1, // Initial quantity value
      sizes: ["S", "M", "L", "XL"], // Define available sizes
      selectedSize: null, // Selected size
      loading: false,
    };
  },
  created() {
    const itemId = this.$route.params.id;
    // Fetch the item details based on the ID
    this.fetchItemDetails(itemId);
  },
  methods: {
    fetchItemDetails(itemId) {
      // Example items array to simulate data fetching
      const items = [
        {
          id: 1,
          name: "Traditional Filipino Barong",
          description:
            "Elegant hand-woven attire symbolizing Filipino heritage.",
          details: "Worn during formal occasions.",
          availability: "Available.",
          tribe: "Tagalog",
          counts: 34,
          image: require("@/assets/TraditionalBarong.jpg"),
        },
        // Add more items as necessary...
      ];

      // Find the item by ID
      this.item = items.find((item) => item.id === Number(itemId));
    },
    increaseQuantity() {
      // Increase quantity but ensure it doesn't exceed the item's available count
      if (this.quantity < this.item.counts) {
        this.quantity++;
      }
    },
    decreaseQuantity() {
      // Decrease quantity but ensure it doesn't go below 1
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    load() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 3000);
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.v-card {
  border-radius: 15px;
}

.v-card-subtitle {
  white-space: normal;
  word-break: break-word;
}
.centered-text-field .v-field__input {
  text-align: center !important; /* Center the text and cursor */
}

.selected-size {
  background-color: #ffc107; /* Highlighted background color */
  color: white !important; /* Text color when selected */
  border-color: #ffc107; /* Border color when selected */
}
</style>
