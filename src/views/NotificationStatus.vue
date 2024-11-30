<template>
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
        :items="items"
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

  <v-container align="center">
    <v-row>
      <v-col></v-col>
      <v-col> </v-col>
    </v-row>
    <v-list-item
      base-color="surface-light"
      border="opacity-50 md"
      lines="two"
      max-width="1000"
      prepend-avatar="https://cdn.vuetifyjs.com/docs/images/one/logos/one.png"
      rounded="lg"
      variant="flat"
    >
      <!-- Username and Borrow Date -->
      <div class="d-flex justify-space-between align-center w-100">
        <a class="text-caption">John Doe</a>
        <span class="text-caption">Borrowed: 2024-11-20</span>
      </div>

      <v-divider></v-divider>

      <!-- Main Content with Buttons -->
      <div class="d-flex justify-space-between align-center w-100 mt-3">
        <div>
          <v-list-item-title class="text-start">
            <span class="text-subtitle-1 font-weight-bold">
              {{ item.name }}
            </span>
          </v-list-item-title>

          <v-list-item-subtitle class="text-start">
            <div class="d-flex justify-space-between">
              <span>Quantity: {{ quantity }}</span>
              <span>Size: {{ size }}</span>
            </div>
          </v-list-item-subtitle>
        </div>

        <!-- Buttons -->
        <div class="d-flex">
          <v-btn
            :key="`subscribe-${isSubscriber}`"
            :border="`thin ${isSubscriber ? 'error' : 'success'}`"
            :color="isSubscriber ? 'error' : 'success'"
            :prepend-icon="isSubscriber ? 'mdi-close' : 'mdi-email'"
            :slim="isSubscriber"
            :text="isSubscriber ? 'Cancel' : 'Subscribe'"
            :variant="isSubscriber ? 'plain' : 'tonal'"
            class="me-2 text-none"
            size="small"
            flat
            @click="isSubscriber = !isSubscriber"
          ></v-btn>

          <v-btn
            :key="`info-${isSubscriber}`"
            :color="isSubscriber ? 'success' : 'primary'"
            :prepend-icon="isSubscriber ? 'mdi-check' : 'mdi-open-in-new'"
            :readonly="isSubscriber"
            :text="isSubscriber ? 'Subscribed' : 'More Info'"
            class="text-none"
            size="small"
            variant="flat"
            flat
          ></v-btn>
        </div>
      </div>
    </v-list-item>
  </v-container>
</template>

<script setup>
import { shallowRef } from "vue";

const isSubscriber = shallowRef(false);
</script>
