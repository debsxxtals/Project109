<template>
  <v-container fluid>
    <v-card elevation="2" class="ma-sm-5">
      <v-row no-gutters>
        <!-- Left Column for Image and Title -->
        <v-col cols="12" sm="6" md="7">
          <v-card-item>
            <v-img
              :src="item.imageUrl"
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
                v-if="role === null"
                color="amber"
                rounded="lg"
                :loading="loading"
                @click="load"
                class="px-4 py-5 py-sm-6 d-flex align-center justify-center"
              >
                Borrow Now
              </v-btn>

              <v-dialog v-model="dialog" max-width="600">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    size="large"
                    class="ml-4 mb-5"
                    color="primary"
                    v-bind="activatorProps"
                    @click="openEditDialog(itemId)"
                    v-if="role === 'admin'"
                  >
                    Edit Item
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title
                    class="d-flex align-center justify-space-between"
                  >
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
                    <v-btn color="primary" variant="flat" @click="saveEdit">
                      Save Changes
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

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
import { ref, onMounted, reactive, watch } from "vue";
import { supabase } from "../supabase";

export default {
  name: "ItemDetails",

  props: ["id"],

  setup(props) {
    const role = ref(
      localStorage.getItem("role") === "null"
        ? null
        : localStorage.getItem("role")
    );

    // Ref for dialog visibility
    const dialog = ref(false);
    const itemId = ref(null);

    const formData = reactive({
      costumeName: "",
      tribes: "",
      category: "",
      briefDetails: "",
      specifications: "",
      smallAvailability: "",
      mediumAvailability: "",
      largeAvailability: "",
      extraLargeAvailability: "",
      image: "",
      imageUrl: "",
    });

    const alertMessage = ref("");
    const alertType = ref("");

    const fetchItemForEdit = async () => {
      try {
        // Fetch inventory data
        const { data: inventoryData, error: inventoryError } = await supabase
          .from("inventory")
          .select("*")
          .eq("id", props.id)
          .single();

        if (inventoryError) throw inventoryError;

        // Assign inventory data to formData
        formData.costumeName = inventoryData.name;
        formData.tribes = inventoryData.tribe;
        formData.category = inventoryData.category;
        formData.briefDetails = inventoryData.details;
        formData.specifications = inventoryData.specifications;

        // Fetch the image path and generate the URL
        if (inventoryData.image_path) {
          const { data: imageUrl, error: imageError } = supabase.storage
            .from("items")
            .getPublicUrl("public/" + inventoryData.image_path);

          if (imageError) throw imageError;

          formData.imageUrl = imageUrl.publicUrl; // Add image URL to formData
        } else {
          formData.imageUrl = null; // Handle case where no image is provided
        }

        // Fetch availability data for the item from the item_sizes table
        const { data: sizeData, error: sizeError } = await supabase
          .from("item_sizes")
          .select("size, quantity")
          .eq("item_id", props.id);

        if (sizeError) throw sizeError;

        // Assign availability data to formData based on size
        sizeData.forEach((item) => {
          if (item.size === "S") {
            formData.smallAvailability = item.quantity;
          } else if (item.size === "M") {
            formData.mediumAvailability = item.quantity;
          } else if (item.size === "L") {
            formData.largeAvailability = item.quantity;
          } else if (item.size === "XL") {
            formData.extraLargeAvailability = item.quantity;
          }
        });
      } catch (error) {
        console.error("Error fetching item:", error);
        alertMessage.value = "Failed to fetch item data.";
        alertType.value = "error";
      }
    };

    const saveEdit = async () => {
      try {
        let imagePath = formData.imageUrl; // Default to the current image path if no new image is selected.

        // If a new image is selected, upload it to Supabase storage
        if (formData.image) {
          const fileName = `public/${props.id}_${formData.image.name}`; // Create a unique path for the image.

          // Upload the image to Supabase storage
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("items")
              .upload(fileName, formData.image, {
                cacheControl: "3600",
                upsert: true, // Set this to true to overwrite existing files with the same name
              });

          if (uploadError) {
            console.error("Image upload error:", uploadError);
            throw uploadError;
          }

          // Get the public URL of the uploaded image (if needed)
          imagePath = uploadData.path;
        }

        // Update inventory table (excluding image)
        const { error: inventoryError } = await supabase
          .from("inventory")
          .update({
            name: formData.costumeName,
            tribe: formData.tribes,
            category: formData.category,
            details: formData.briefDetails,
            specifications: formData.specifications,
            image_path: imagePath, // Update with the new image path if uploaded
          })
          .eq("id", props.id);

        if (inventoryError) throw inventoryError;

        // Update item_sizes table for each size
        const updateSizePromises = [];
        const sizes = [
          { size: "S", availability: formData.smallAvailability },
          { size: "M", availability: formData.mediumAvailability },
          { size: "L", availability: formData.largeAvailability },
          { size: "XL", availability: formData.extraLargeAvailability },
        ];

        sizes.forEach(({ size, availability }) => {
          if (availability !== "") {
            updateSizePromises.push(
              supabase
                .from("item_sizes")
                .upsert({
                  item_id: props.id,
                  size: size,
                  quantity: availability,
                })
                .eq("item_id", props.id)
                .eq("size", size)
            );
          }
        });

        // Wait for all updates to finish
        await Promise.all(updateSizePromises);

        // Success message
        alertMessage.value =
          "Costume item and availability successfully updated!";
        alertType.value = "success";
        dialog.value = false;
        resetForm();
      } catch (error) {
        console.error("Error updating item:", error);
        alertMessage.value =
          "An error occurred while updating the costume item.";
        alertType.value = "error";
      }
    };

    // Reset form data after saving
    const resetForm = () => {
      Object.keys(formData).forEach((key) => {
        formData[key] = key.includes("Availability") ? 0 : "";
      });
    };

    // Open the dialog and fetch data for editing
    const openEditDialog = () => {
      itemId.value = props.id;
      fetchItemForEdit();
      dialog.value = true;
    };

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
      try {
        // Fetch item details from the inventory table
        const { data, error } = await supabase
          .from("inventory")
          .select("*")
          .eq("id", props.id)
          .single();

        if (error) throw error;

        // If the item has an image path, fetch the image URL from Supabase storage
        if (data.image_path) {
          const { data: imageUrlData, error: imageError } =
            await supabase.storage.from("items").getPublicUrl(data.image_path); // Assuming image_path is just the path, not the full URL

          if (imageError) throw imageError;

          // Add the image URL to the item data
          data.imageUrl = imageUrlData.publicUrl;
        }

        // Assign the fetched data to the item ref
        item.value = { ...data }; // Spread the data to ensure reactivity
      } catch (error) {
        console.error("Error fetching item details:", error.message);
      }
    };

    // Fetch item sizes
    const getItemSizes = async () => {
      const { data, error } = await supabase
        .from("item_sizes")
        .select("size, quantity")
        .eq("item_id", props.id);

      if (error) {
        console.error(error);
      } else {
        // Define your custom order for sizes
        const customOrder = ["S", "M", "L", "XL"];

        // Sort data based on the custom order
        const sortedData = data.sort((a, b) => {
          return customOrder.indexOf(a.size) - customOrder.indexOf(b.size);
        });

        // Map sizes and quantities
        sizes.value = sortedData.map((item) => item.size);
        sizeQuantities.value = sortedData.reduce(
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
        favorites.value = new Set(favoriteItems.map((item) => item.item_id));
        localStorage.setItem("favorites", JSON.stringify([...favorites.value]));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    watch(role, (newRole) => {
      console.log("Role changed:", newRole);
    });

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
      role,
      dialog,
      alertMessage,
      alertType,
      formData,

      openEditDialog,
      saveEdit,
    };
  },
};
</script>

<style scoped>
.selected-size {
  background-color: amber;
}
</style>
