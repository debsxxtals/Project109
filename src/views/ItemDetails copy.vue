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
          <v-card-subtitle class="pt-0 mt-0 mb-5">{{ item.details }}</v-card-subtitle>

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
                {{ totalQuantity !== null ? totalQuantity : 'Loading...' }}
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
                  :disabled="!selectedSize || sizeQuantities[selectedSize] === 0"
                  :max="selectedSize ? sizeQuantities[selectedSize] : 1"
                  style="max-width: 50px"
                />

                <v-btn
                  icon
                  @click="increaseQuantity"
                  :disabled="!selectedSize || quantity >= sizeQuantities[selectedSize]"
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
              <v-col cols="8" md="9" class="d-flex align-content-start flex-wrap">
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
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>


<script>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

export default {
  props: ["id"],

  setup(props) {
    const item = ref({});
    const totalQuantity = ref(null);
    const sizes = ref([]);
    const sizeQuantities = ref({});
    const selectedSize = ref(null);
    const quantity = ref(1);

    const getItemDetails = async () => {
      const { data, error } = await supabase.from("inventory").select("*").eq("id", props.id).single();
      if (error) console.error(error);
      else item.value = data;
    };

    const getItemSizes = async () => {
      const { data, error } = await supabase.from("item_sizes").select("size, quantity").eq("item_id", props.id);
      if (error) console.error(error);
      else {
        sizes.value = data.map((item) => item.size);
        sizeQuantities.value = data.reduce((acc, curr) => ({ ...acc, [curr.size]: curr.quantity }), {});
      }
    };

    const getTotalQuantityPerItem = async () => {
      const { data, error } = await supabase.rpc("get_total_quantity_per_item", { item_id_param: props.id });
      if (error) console.error(error);
      else totalQuantity.value = data || 0;
    };

    const selectSize = (size) => {
      selectedSize.value = size;
      quantity.value = 1; // Reset quantity on size change
    };

   const increaseQuantity = () => {
  if (
    selectedSize.value && // Ensure a size is selected
    sizeQuantities.value[selectedSize.value] > quantity.value // Check if stock is available
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

    onMounted(async () => {
      await Promise.all([getItemDetails(), getItemSizes(), getTotalQuantityPerItem()]);
    });

    return {
      item,
      totalQuantity,
      sizes,
      sizeQuantities,
      selectedSize,
      quantity,
      selectSize,
      increaseQuantity,
      decreaseQuantity,
    };
  },
};

</script>

<style scoped>
.selected-size {
  background-color: amber;
}
</style>
