<template>
  <v-app>
    <!-- Conditionally render app bar and navigation drawer -->
    <v-app-bar v-if="!isLandingPage" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Culture Closet</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-if="!isLandingPage" v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">Welcome</v-list-item-title>
          <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link v-for="item in menuItems" :key="item.title">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <!-- Main content -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const drawer = ref(null)
</script>

<script>
export default {
  data() {
    return {
      
      menuItems: [
        { title: "Home", icon: "mdi-home" },
        { title: "Collections", icon: "mdi-tshirt-crew" },
        { title: "Profile", icon: "mdi-account" },
      ],
    };
  },
  computed: {
    isLandingPage() {
      return this.$route.path === "/"; // Check if the current path is the landing page
    },
  },
};
</script>
