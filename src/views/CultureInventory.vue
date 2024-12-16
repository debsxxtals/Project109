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
                  <v-col cols="12">
                    <v-file-input
                      v-model="formData.image"
                      label="Costume Image"
                      accept="image/*"
                      variant="solo"
                      prepend-icon="mdi-image"
                      required
                      chips
                      show-size
                      density="compact"
                    ></v-file-input>
                  </v-col>

                  <!-- Costume Name -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.costumeName"
                      variant="solo-filled"
                      label="Costume Name"
                      required
                    ></v-text-field>
                  </v-col>

                  <!-- Tribes -->
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="formData.tribes"
                      hint=" (e.g Manobo, Tagalog, Butuanon)"
                      label="Tribes"
                      variant="solo-filled"
                      required
                    ></v-text-field>
                  </v-col>

                  <!-- Category -->
                  <v-col cols="12" sm="6">
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
                      required
                    ></v-select>
                  </v-col>

                  <!-- Sizes and Availability -->

                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      value="Small"
                      readonly
                      variant="solo-filled"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      v-model="formData.smallAvailability"
                      variant="solo-filled"
                      label="Availability"
                      type="number"
                      min="0"
                      step="1"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      value="Medium"
                      readonly
                      variant="solo-filled"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      v-model="formData.mediumAvailability"
                      variant="solo-filled"
                      label="Availability"
                      type="number"
                      min="0"
                      step="1"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      value="Large"
                      readonly
                      variant="solo-filled"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      v-model="formData.largeAvailability"
                      variant="solo-filled"
                      label="Availability"
                      type="number"
                      min="0"
                      step="1"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      value="Extra-Large"
                      readonly
                      variant="solo-filled"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3" sm="3">
                    <v-text-field
                      v-model="formData.extraLargeAvailability"
                      variant="solo-filled"
                      label="Availability"
                      type="number"
                      min="0"
                      step="1"
                    ></v-text-field>
                  </v-col>

                  <!-- Brief Details -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.briefDetails"
                      variant="solo-filled"
                      label="Brief Details"
                      required
                    ></v-text-field>
                  </v-col>

                  <!-- Specifications -->
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.specifications"
                      variant="solo-filled"
                      label="Costume Specifications and Description"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">
                  *indicates required field
                </small>

                <!-- Alert Message -->
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
                <v-btn color="primary" variant="flat" @click="addItem">
                  Add
                </v-btn>
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
      smallAvailability: 0, // For Small size availability
      mediumAvailability: 0, // For Medium size availability
      largeAvailability: 0, // For Large size availability
      extraLargeAvailability: 0, // For Extra-Large size availability
      briefDetails: "",
      specifications: "",
      image: "",
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
    // Function to add the item to the inventory and item_sizes table
    const addItem = async () => {
      try {
        // Validate image file input
        if (!formData.image) {
          alertMessage.value = "Please upload an image.";
          alertType.value = "error";
          return;
        }

        // Upload image to Supabase storage
        const { data: imageData, error: imageUploadError } =
          await supabase.storage
            .from("items")
            .upload(`public/${formData.image.name}`, formData.image, {
              cacheControl: "3600",
              upsert: false,
            });

        if (imageUploadError) {
          console.error("Error uploading image:", imageUploadError);
          alertMessage.value = "Error uploading image. Please try again.";
          alertType.value = "error";
          return;
        }

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
              image_path: imageData.path, // Store image path in the database
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

        // Prepare item sizes data (include sizes with quantity 0)
        const sizeEntries = [
          { size: "S", quantity: parseInt(formData.smallAvailability) || 0 },
          { size: "M", quantity: parseInt(formData.mediumAvailability) || 0 },
          { size: "L", quantity: parseInt(formData.largeAvailability) || 0 },
          {
            size: "XL",
            quantity: parseInt(formData.extraLargeAvailability) || 0,
          },
        ].map((entry) => ({
          item_id: itemId,
          size: entry.size, // Directly use the size label (S, M, L, XL)
          quantity: entry.quantity,
        }));

        // Insert sizes into item_sizes table
        const { error: upsertError } = await supabase
          .from("item_sizes")
          .insert(sizeEntries);

        if (upsertError) {
          console.error("Error inserting item sizes:", upsertError);
          alertMessage.value = "Error adding item sizes. Please try again.";
          alertType.value = "error";
          return;
        }

        // Success message
        alertMessage.value = "Item successfully added!";
        alertType.value = "success";

        // Reset form data
        Object.assign(formData, {
          costumeName: "",
          tribes: "",
          category: "",
          smallAvailability: 0,
          mediumAvailability: 0,
          largeAvailability: 0,
          extraLargeAvailability: 0,
          briefDetails: "",
          specifications: "",
          image: null, // Reset image field
        });
      } catch (error) {
        console.error("Unexpected error:", error);
        alertMessage.value = "An unexpected error occurred. Please try again.";
        alertType.value = "error";
      }
    };

    // Function to fetch data with optional search keyword
    const getDatas = async (keyword = "") => {
      const baseImageUrl =
        "https://mqablnufetjbxivjsycu.supabase.co/storage/v1/object/public/items/";

      let { data: items, error } = await supabase
        .from("inventory")
        .select("*")
        .or(`name.ilike.%${keyword}%,tribe.ilike.%${keyword}%`)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching inventory:", error.message);
      } else {
        // Add full image URL to each item
        items = items.map((item) => ({
          ...item,
          image: item.image_path ? `${baseImageUrl}${item.image_path}` : null,
        }));

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

    const addToFavorites = async (itemId) => {
      try {
        const user_id = localStorage.getItem("userId");

        let uni_id = null;

        // Step 1: Check the profiles table for email-based login
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("uni_id")
          .eq("auth_id", user_id)
          .single();

        if (profileData) {
          // User is found in the profiles table (email login)
          uni_id = profileData.uni_id;
        } else if (profileError) {
          console.warn("User not found in profiles table:", profileError);
        }

        // Step 2: Check the users table for Google login (if not found in profiles)
        if (!uni_id) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email") // Adjust this field based on your users table schema
            .eq("auth_id", user_id)
            .single();

          if (userData) {
            // User is found in the users table (Google login)
            uni_id = userData.email; // Assuming `email` is the unique identifier for Google accounts
          } else if (userError) {
            console.error("Error finding user in users table:", userError);
            return;
          }
        }

        // If uni_id is still not found, exit
        if (!uni_id) {
          console.error("User ID not found in either table.");
          return;
        }

        // Step 3: Check if the item is already in the favorites table
        const { data: favoriteItems, error: favoriteError } = await supabase
          .from("favorites")
          .select("*")
          .or(`user_id.eq.${uni_id},acc_id.eq.${uni_id}`) // Use OR to check both user_id and acc_id
          .eq("item_id", itemId);

        if (favoriteError) {
          console.error("Error checking favorite items:", favoriteError);
          return;
        }

        // Step 4: If item is in favorites, remove it; otherwise, add it
        if (favoriteItems.length > 0) {
          // Item is already in favorites, so remove it
          const { data: removedData, error: removeError } = await supabase
            .from("favorites")
            .delete()
            .or(`user_id.eq.${uni_id},acc_id.eq.${uni_id}`) // Match either user_id or acc_id
            .eq("item_id", itemId);

          if (removeError) {
            console.error("Error removing item from favorites:", removeError);
          } else {
            console.log(
              "Item removed from favorites successfully:",
              removedData
            );
            favorites.value.delete(itemId);
            updateLocalStorage();
            snackbarMessage.value = "Unsaved from favorites";
            snackbar.value = true;
          }
        } else {
          // Item is not in favorites, so add it
          const insertData = uni_id.includes("@") // Check if uni_id is an email
            ? { acc_id: uni_id, item_id: itemId } // For email, use user_id
            : { user_id: uni_id, item_id: itemId }; // For Google, use acc_id

          const { data: addedData, error: addError } = await supabase
            .from("favorites")
            .insert([insertData]);

          if (addError) {
            console.error("Error adding item to favorites:", addError);
          } else {
            console.log("Item added to favorites successfully:", addedData);
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

        let uni_id;

        // Step 1: Check the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("uni_id")
          .eq("auth_id", user_id)
          .single();

        if (profileData) {
          // User is found in the profiles table
          uni_id = profileData.uni_id;
        } else if (profileError) {
          console.warn("User not found in profiles table:", profileError);

          // Step 2: If not found in profiles, check the users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email") // Replace "id" with the appropriate unique identifier in your users table
            .eq("auth_id", user_id)
            .single();

          if (userData) {
            // User is found in the users table
            uni_id = userData.email;
          } else if (userError) {
            console.error("Error finding user in users table:", userError);
            return;
          }
        }

        if (!uni_id) {
          console.error("User ID not found in either table.");
          return;
        }

        // Step 3: Fetch the user's favorite items using uni_id
        const { data: favoriteItems, error: favoriteError } = await supabase
          .from("favorites")
          .select("item_id")
          .or(`user_id.eq.${uni_id},acc_id.eq.${uni_id}`); // This checks both user_id and acc_id

        if (favoriteError) {
          console.error("Error fetching favorite items:", favoriteError);
          return;
        }

        // Step 4: Load favorite items into the reactive state
        favorites.value = new Set(favoriteItems.map((item) => item.item_id));
        localStorage.setItem("favorites", JSON.stringify([...favorites.value]));
      } catch (err) {
        console.error("Unexpected error fetching favorites:", err);
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
