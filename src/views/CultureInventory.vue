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
      <v-col cols="12">
        <v-autocomplete
          class="mx-auto rounded-lg"
          density="comfortable"
          menu-icon=""
          placeholder="Find costume you like to borrow"
          append-inner-icon="mdi-magnify"
          style="max-width: 700px"
          theme="light"
          variant="solo"
          item-props
          clearable
        ></v-autocomplete>
      </v-col>
    </v-row>

    <div id="get_data">
      <v-container>
        <v-row>
          <v-col
            v-for="item in inventory"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="ma-3" @click="viewDetails(item.id)" hover>
              <v-img
                :src="item.image"
                height="200px"
                class="white--text"
                contain
              ></v-img>
              <v-card-title class="mb-0 py-0 mt-2 text-h6">{{
                item.name
              }}</v-card-title>
              <v-card-subtitle class="mt-0 py-0">{{
                item.details
              }}</v-card-subtitle>

              <v-card-text
                class="d-flex align-center text-subtitle-2 font-weight-medium px-4 py-0"
              >
                Category :
                <v-chip
                  class="ma-0 font-weight-medium ml-1"
                  size="small"
                  color="amber"
                  text-color="black"
                  rounded
                  variant="flat"
                >
                  {{ item.tribe }}
                </v-chip>

                <v-card-actions class="pa-0 ml-auto">
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
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>
</template>

<style scoped>
.v-card {
  box-sizing: border-box; /* Ensure padding and border are included in the card's size */
}

.v-card:hover {
  outline: 3px solid #ffc107; /* Highlight color without affecting the layout */
}
</style>

<script>
import { supabase } from "../supabase";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const inventory = ref([]);

    // Fetch inventory data from Supabase
    const getDatas = async () => {
      let { data: inventoryData, error } = await supabase
        .from("inventory")
        .select("*");

      if (error) {
        console.error("Error fetching inventory:", error.message);
      } else {
        inventory.value = inventoryData;
      }
    };

    // Navigate to details page
    const viewDetails = (itemId) => {
      console.log("View details for:", itemId);
      // Replace with Vue Router navigation if needed:
      this.$router.push({ name: "ItemDetails", params: { id: itemId } });
    };

    // Add to favorites
    const addToFavorites = (itemId) => {
      console.log("Add to favorites:", itemId);
    };

    onMounted(() => {
      getDatas();
    });

    return {
      inventory,
      viewDetails,
      addToFavorites,
    };
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
