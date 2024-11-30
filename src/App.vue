<template>
  <v-app>
    <!-- Conditionally render app bar and navigation drawer -->
    <v-app-bar v-if="!isLandingPage" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Culture Closet</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-if="!isLandingPage" v-model="drawer" app>
      <v-list-item class="d-flex flex-column align-center my-5">
        <v-list-item class="d-flex flex-column align-center">
          <v-avatar
            image="/images/default.jpg"
            size="50"
            border="sm"
          ></v-avatar>

          <v-list-item-title class="text-h6 text-center">{{
            firstName + " " + lastName
          }}</v-list-item-title>
          <v-list-item-subtitle class="text-center">{{
            userEmail
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list-item>

      <v-divider class="mb-10"></v-divider>

      <v-list class="text-center">
        <v-list-item
          link
          v-for="item in menuItems"
          :key="item.title"
          @click="handleMenuClick(item)"
        >
          <v-list-item>
            <v-list-item-title class="text-h5 font-weight-medium">{{
              item.title
            }}</v-list-item-title>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <!-- Main content -->
      <router-view />
    </v-main>
    <v-footer class="bg-white text-center d-flex flex-column mt-10">
      <div class="ma-10">
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-4"
          variant="text"
        ></v-btn>
      </div>

      <div class="pt-0 pa-10">
        Culture Closet is an innovative platform dedicated to celebrating and
        preserving the rich cultural heritage of diverse communities. It offers
        a virtual space where users can explore traditional costumes, dances,
        stories, and artifacts, providing insight into the significance of these
        cultural elements. The platform includes features for managing costumes,
        curating traditional dances and performances, and sharing folklore and
        oral traditions, allowing users to learn about the history and origins
        of these cultural practices. By promoting cultural awareness and
        fostering community engagement, Culture Closet serves as a collaborative
        space for individuals to connect, share, and appreciate the traditions
        that shape our world. Through this initiative, Culture Closet not only
        preserves cultural heritage but also encourages cross-cultural
        understanding and appreciation.
      </div>

      <v-divider
        :thickness="7"
        class="border-opacity-100"
        color="warning"
      ></v-divider>
      <div>{{ new Date().getFullYear() }} — <strong>Vuetify</strong></div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "./supabase"; // Import your Supabase client

const drawer = ref(false);
const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const userEmail = ref("");

// Fetch user data when component is mounted
onMounted(() => {
  getUserData();
});

const icons = ref([
  "mdi-facebook",
  "mdi-twitter",
  "mdi-linkedin",
  "mdi-instagram",
]);

const menuItems = [
  { title: "Home", path: "/home" },
  { title: "Inventory", path: "/inventory" },
  { title: "Status", path: "/status" },
  { title: "Settings", path: "/settings" },
  { title: "Logout", action: "logout" }, // Action to trigger logout
];

async function getUserData() {
  // Fetch the authenticated user (from auth.users table)
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.log("Error fetching user:", userError);
    return;
  }

  if (user) {
    // Get the user's email from the auth user object
    userEmail.value = user.email; // Email from auth.users table

    // Get the user ID from localStorage or Supabase auth session
    const userId = localStorage.getItem("userId") || user.id; // Use user.id directly if available

    if (userId) {
      // Fetch the user's profile data from the 'profiles' table (first_name, last_name)
      const { data: profiles, error: profileError } = await supabase
        .from("profiles") // Your custom 'profiles' table
        .select("first_name, last_name") // Only select first_name and last_name
        .eq("auth_id", userId) // Ensure this column links to the Supabase auth user ID
        .single(); // Assuming there's one profile per user

      if (profileError) {
        console.log("Error fetching profile:", profileError);
      } else {
        // Set first name and last name from profiles table
        firstName.value = profiles.first_name;
        lastName.value = profiles.last_name;
      }
    } else {
      console.log("No user ID found in localStorage or auth session.");
    }
  }
}

// Computed property to check if the current page is the landing page
const isLandingPage = computed(() => {
  return router.currentRoute.value.path === "/"; // Check if the current path is the landing page
});

// Method to handle menu item clicks
const handleMenuClick = async (item) => {
  if (item.action === "logout") {
    await logout();
  } else {
    // Navigate to the respective path
    router.push(item.path);
  }
};

// Logout function
const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    alert("Logging out...");
    // Clear local storage
    localStorage.clear();
    // Redirect to login page
    router.push("/");
  } else {
    alert("Logout failed: " + error.message);
  }
};
</script>
