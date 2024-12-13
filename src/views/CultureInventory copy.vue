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
        <v-row
          class="d-flex align-center justify-center flex-column flex-sm-row"
        >
          <v-form
            @submit.prevent="handleSearch"
            style="max-width: 500px; flex-grow: 1"
            class="d-flex align-center"
          >
            <v-text-field
              v-model="searchKeyword"
              label="Find costume you like to borrow"
              variant="solo"
              clearable
              style="min-width: 250px; width: 100%"
              class="rounded-lg"
              @click:append-outer="handleSearch"
            >
              <template v-slot:append-inner>
                <v-btn
                  @click.stop="handleSearch"
                  color="primary"
                  icon
                  density="comfortable"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-form>

          <!-- Dialog for Adding Item -->
          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                size="large"
                class="ml-4 mb-5"
                color="primary"
                v-bind="activatorProps"
                v-if="role === 'admin'"
              >
                Add Item
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" dark>mdi-hanger</v-icon>
                  <span class="text-h6">Add Costume Item</span>
                </div>
                <v-btn
                  icon="mdi-window-close"
                  @click="dialog = false"
                  variant="plain"
                  class="ml-2"
                ></v-btn>
              </v-card-title>

              <v-card-text>
                <v-row dense>

                  

                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="formData.costumeName"
                      variant="solo-filled"
                      label="Costume Name"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="formData.tribes"
                      hint=" (e.g Manobo, Tagalog, Butuanon)"
                      label="Tribes"
                      variant="solo-filled"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="5" sm="6">
                    <v-select
                      v-model="formData.category"
                      label="Category"
                      :items="[
                        'Top',
                        'Bottom',
                        'Set',
                        'Dresses',
                        'Outerwear',
                        'Footwear',
                        'Accessories',
                        'Headresses',
                      ]"
                      variant="solo-filled"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-select
                      v-model="formData.size"
                      label="Size"
                      :items="['Small', 'Medium', 'Large', 'Extra-Large']"
                      variant="solo-filled"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" md="3" sm="3">
                    <v-text-field
                      v-model="formData.availability"
                      variant="solo-filled"
                      label="Availability"
                      required
                      type="number"
                      min="0"
                      step="1"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="12" sm="9">
                    <v-text-field
                      v-model="formData.briefDetails"
                      variant="solo-filled"
                      label="Brief Details"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.specifications"
                      variant="solo-filled"
                      label="Costume Specifications and Description"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis"
                  >*indicates required field</small
                >
                <!-- Alert message here -->
                <v-alert
                  v-if="alertMessage"
                  :type="alertType"
                  dismissible
                  class="mt-4"
                >
                  {{ alertMessage }}
                </v-alert>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="primary"
                  text="Add"
                  variant="flat"
                  type="submit"
                  @click="addItem"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
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
            lg="3"
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
                    :color="isFavorite(item.id) ? 'green' : 'default'"
                  >
                    <v-icon>{{
                      isFavorite(item.id) ? "mdi-heart" : "mdi-heart-outline"
                    }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-snackbar v-model="snackbar" :timeout="3000" top>
                  {{ snackbarMessage }}
                </v-snackbar>
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
import { useRouter } from "vue-router";
import { ref, onMounted, nextTick, reactive } from "vue";

export default {
  name: "CultureInventory",
  setup() {
    const role = ref(localStorage.getItem("role") || "");
    // Ref for dialog visibility
    const dialog = ref(false);

    // Reactive form data object
    const formData = reactive({
      costumeName: "",
      tribes: "",
      category: "",
      size: "",
      availability: 0,
      briefDetails: "",
      specifications: "",
    });

    const inventory = ref([]);
    const searchKeyword = ref("");
    const router = useRouter();
    const snackbar = ref(false); // Control the snackbar visibility
    const snackbarMessage = ref(""); // Message to display in snackbar
    const favorites = ref(new Set()); // Track favorite items using a ref for reactivity
    const alertMessage = ref(""); // Message for success or error
    const alertType = ref("success"); // Type of alert (success/error)

    // Size map to convert the size into enum value
   

    // Function to add the item to the inventory and item_sizes table
    const addItem = async () => {
      // Map the selected size to the enum value
      const mappedSize = sizeMap[formData.size];

      // Insert the costume data into the inventory table
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .insert([
          {
            name: formData.costumeName,
            category: formData.category,
            tribe: formData.tribes,
            details: formData.briefDetails,
            specifications: formData.specifications,
          },
        ])
        .select();

      if (inventoryError) {
        console.error("Error inserting into inventory:", inventoryError);
        alertMessage.value =
          "Error inserting item into inventory. Please try again.";
        alertType.value = "error";
        return;
      }

      // Check if inventoryData has data
      if (!inventoryData || inventoryData.length === 0) {
        console.error("No inventory data returned.");
        alertMessage.value = "No inventory data returned. Please try again.";
        alertType.value = "error";
        return;
      }

      // Use inventoryData[0].id to get the id of the inserted item
      const itemId = inventoryData[0].id;

      // Call the upsert function to handle the item size
      const { error: upsertError } = await supabase.from("item_sizes").insert([
        {
          item_id: itemId, // Ensure this is referencing the correct id
          size: mappedSize, // Pass the mapped size (e.g., 'S', 'M', etc.)
          quantity: parseInt(formData.availability), // Ensure availability is an integer
        },
      ]);

      if (upsertError) {
        console.error("Error upserting item size:", upsertError);
        alertMessage.value = "Error updating item size. Please try again.";
        alertType.value = "error";
        return;
      }

      // Success message
      alertMessage.value = "Item successfully added!";
      alertType.value = "success";

      formData.value = {
        costumeName: "",
        tribes: "",
        category: "",
        size: "",
        availability: "",
        briefDetails: "",
        specifications: "",
      };
    };

    // Function to fetch data with optional search keyword
    const getDatas = async (keyword = "") => {
      let { data: items, error } = await supabase
        .from("inventory")
        .select("*")
        .or(`name.ilike.%${keyword}%,tribe.ilike.%${keyword}%`);

      if (error) {
        console.error("Error fetching inventory:", error.message);
      } else {
        inventory.value = items;
      }
    };

    // Search handler
    const handleSearch = (e) => {
      e.preventDefault();
      getDatas(searchKeyword.value); // Fetch with the current search keyword
    };

    // Navigate to details page
    const viewDetails = (itemId) => {
      console.log("View details for:", itemId);
      // Replace with Vue Router navigation if needed:
      router.push({ name: "ItemDetails", params: { id: itemId } });
    };

    // Function to check if an item is in the favorites
    const isFavorite = (itemId) => {
      return favorites.value.has(itemId);
    };

    // Function to toggle favorite status (add or remove from favorites)
    const addToFavorites = async (itemId) => {
      try {
        const user_id = localStorage.getItem("userId");

        // Step 1: Get the logged-in user's profile
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("uni_id")
          .eq("auth_id", user_id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        // Step 2: Check if the item is already in the favorites table
        const { data: favoriteItems, error: favoriteError } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", userProfile.uni_id)
          .eq("item_id", itemId);

        if (favoriteError) {
          console.error("Error checking favorite items:", favoriteError);
          return;
        }

        // Step 3: If item is in favorites, remove it; otherwise, add it
        if (favoriteItems.length > 0) {
          // Item is already in favorites, so remove it
          const { data: removedData, error: removeError } = await supabase
            .from("favorites")
            .delete()
            .match({ user_id: userProfile.uni_id, item_id: itemId });

          if (removeError) {
            console.error("Error removing item from favorites:", removeError);
          } else {
            console.log(
              "Item removed from favorites successfully:",
              removedData
            );
            // Update local state
            favorites.value.delete(itemId);
            updateLocalStorage();
            snackbarMessage.value = "Unsaved from favorites";
            snackbar.value = true;
          }
        } else {
          // Item is not in favorites, so add it
          const { data: addedData, error: addError } = await supabase
            .from("favorites")
            .insert([{ user_id: userProfile.uni_id, item_id: itemId }]);

          if (addError) {
            console.error("Error adding item to favorites:", addError);
          } else {
            console.log("Item added to favorites successfully:", addedData);
            // Update local state
            favorites.value.add(itemId);
            updateLocalStorage();
            snackbarMessage.value = "Saved to favorites";
            snackbar.value = true;
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    // Function to fetch user's favorites on login
    const fetchFavorites = async () => {
      try {
        const user_id = localStorage.getItem("userId");
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("uni_id")
          .eq("auth_id", user_id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        const { data: favoriteItems, error: favoriteError } = await supabase
          .from("favorites")
          .select("item_id")
          .eq("user_id", userProfile.uni_id);

        if (favoriteError) {
          console.error("Error fetching favorite items:", favoriteError);
          return;
        }

        // Load favorite items into the reactive state
        favorites.value = new Set(favoriteItems.map((item) => item.item_id));
        localStorage.setItem("favorites", JSON.stringify([...favorites.value]));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    onMounted(async () => {
      await nextTick();
      getDatas();
      const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
      if (savedFavorites) {
        savedFavorites.forEach((itemId) => favorites.value.add(itemId));
      }
      fetchFavorites();
    });

    // Function to update localStorage with current favorites state
    const updateLocalStorage = () => {
      localStorage.setItem("favorites", JSON.stringify([...favorites.value]));
    };

    return {
      inventory,
      searchKeyword,
      handleSearch,
      viewDetails,
      isFavorite,
      addToFavorites,
      snackbar,
      snackbarMessage,
      dialog,
      formData,
      addItem,
      alertMessage,
      alertType,
      role,
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
