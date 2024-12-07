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
            item.details
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
              <v-col cols="7" sm="8" md="9">
                {{ totalQuantity !== null ? totalQuantity : "Loading..." }}
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider class="ma-5"></v-divider>

          <v-card-text
            class="text-subtitle-1 font-weight-medium d-flex align-center"
          >
            <v-row align="center">
              <v-col cols="4" md="3">Quantity</v-col>
              <v-col cols="8" md="9" class="d-flex align-center">
                <v-btn
                  icon
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="mx-2"
                  rounded="0"
                  size="x-small"
                  variant="flat"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>

                <v-text-field
                  v-model="quantity"
                  class="mx-2"
                  variant="plain"
                  density="comfortable"
                  type="number"
                  :disabled="
                    !selectedSize || sizeQuantities[selectedSize] === 0
                  "
                  :max="selectedSize ? sizeQuantities[selectedSize] : 1"
                  style="max-width: 50px"
                />

                <v-btn
                  icon
                  @click="increaseQuantity"
                  :disabled="
                    !selectedSize || quantity >= sizeQuantities[selectedSize]
                  "
                  class="mx-2"
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
                  @click="selectSize(size)"
                  :class="{ 'selected-size': selectedSize === size }"
                  class="mx-1 mb-2"
                  color="amber"
                  variant="outlined"
                  small
                  :ripple="false"
                  :disabled="sizeQuantities[size] === 0"
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
                  @click="addToFavorites(item.id)"
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
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

export default {
  name: "ItemDetails",

  props: ["id"],

  setup(props) {
    const user = ref(null);
    const loading = ref(false);
    const selectedSize = ref(null);
    const quantity = ref(1);
    const item = ref({});
    const totalQuantity = ref(null);
    const sizes = ref([]);
    const sizeQuantities = ref({});
    const favorites = ref(new Set());
    const snackbar = ref(false); // Control the snackbar visibility
    const snackbarMessage = ref(""); // Message to display in snackbar

    // Fetch user session
    // Fetch user from localStorage or Supabase session
    const getUser = async () => {
      
      // if (session?.user) {
      //   // Access the user's email directly from session.user
      //   const userEmail = session.user.email;
      //   console.log("User Email:", userEmail);
      //   user.value = session.user; // Store the entire user object if needed

      //   // Optionally, you can store the email in your app state or localStorage
      //   // localStorage.setItem("userEmail", userEmail);
      // } else {
      //   console.log("No user is logged in");
      // }

      const userId = localStorage.getItem("userId");
      console.log(userId);
      if (userId) {
        // Fetch the user profile from the 'profiles' table
        const { data, error } = await supabase
          .from("profiles")
          .select("uni_id")
          .eq("auth_id", userId) // Assuming 'user_id' is the foreign key in the profiles table
          .single();

        if (error || !data) {
          console.error(
            "Error fetching user profile:",
            error?.message || "No profile found"
          );
          return;
        }

        // Set the user value from the profiles table
        user.value = data;
      }
    };

    // Fetch item details
    const getItemDetails = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", props.id)
        .single();
      if (error) console.error(error);
      else item.value = data;
    };

    // Fetch item sizes
    const getItemSizes = async () => {
      const { data, error } = await supabase
        .from("item_sizes")
        .select("size, quantity")
        .eq("item_id", props.id);
      if (error) console.error(error);
      else {
        sizes.value = data.map((item) => item.size);
        sizeQuantities.value = data.reduce(
          (acc, curr) => ({ ...acc, [curr.size]: curr.quantity }),
          {}
        );
      }
    };

    // Fetch total quantity
    const getTotalQuantityPerItem = async () => {
      const { data, error } = await supabase.rpc(
        "get_total_quantity_per_item",
        { item_id_param: props.id }
      );
      if (error) console.error(error);
      else totalQuantity.value = data || 0;
    };

    const selectSize = (size) => {
      selectedSize.value = size;
      quantity.value = 1; // Reset quantity on size change
    };

    const increaseQuantity = () => {
      if (
        selectedSize.value &&
        sizeQuantities.value[selectedSize.value] > quantity.value
      ) {
        quantity.value++;
      } else if (!selectedSize.value) {
        console.warn("Please select a size before adjusting the quantity.");
      } else {
        console.warn(
          "Cannot increase quantity beyond available stock for this size."
        );
      }
    };

    const decreaseQuantity = () => {
      if (quantity.value > 1) quantity.value--;
    };

    const load = async () => {
      if (!user.value) {
        console.error("User not logged in");
        return;
      }

      if (!selectedSize.value) {
        console.error("No size selected");
        return;
      }

      loading.value = true;

      const transactionData = {
        uni_id: user.value.uni_id, // User's ID from session
        item_id: props.id, // Item ID from the props
        quantity: quantity.value, // Selected quantity
        size: selectedSize.value, // Selected size
        created_at: new Date().toISOString(), // Timestamp
      };

      const { data, error } = await supabase
        .from("transaction")
        .insert([transactionData]);

      loading.value = false;

      if (error) {
        console.error("Error inserting transaction:", error.message);
      } else {
        console.log("Transaction inserted successfully:", data);
        // Navigate to success page or show success message
      }
    };

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
            console.log("Item removed from favorites successfully:", removedData);
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
    // Function to check if item is in favorites
    const isFavorite = (itemId) => {
      return favorites.value.has(itemId);
    };

    const updateLocalStorage = () => {
      localStorage.setItem("favorites", JSON.stringify([...favorites.value]));
    };

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
        favorites.value = new Set(favoriteItems.map(item => item.item_id));
        localStorage.setItem("favorites", JSON.stringify([...favorites.value]));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    // Fetch item details on mounted
    onMounted(async () => {
      await Promise.all([
        getUser(),
        getItemDetails(),
        getItemSizes(),
        getTotalQuantityPerItem(),
      ]);
      const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
      if (savedFavorites) {
        savedFavorites.forEach((itemId) => favorites.value.add(itemId));
      }
      fetchFavorites();
    });

    return {
      user,
      loading,
      quantity,
      selectedSize,
      item,
      sizes,
      sizeQuantities,
      totalQuantity,
      selectSize,
      increaseQuantity,
      decreaseQuantity,
      load,
      addToFavorites,
      getUser,
      isFavorite,
      snackbar,
      snackbarMessage,
    };
  },
};
</script>

<style scoped>
.selected-size {
  background-color: amber;
}
</style>
