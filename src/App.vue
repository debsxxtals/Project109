<template>
  <v-app>
    <v-app-bar v-show="!isLandingPage" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Culture Closet</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-if="!isLandingPage" v-model="drawer" app>
      <v-list-item class="d-flex flex-column align-center my-5">
        <v-avatar image="/images/default.jpg" size="50" border="sm"></v-avatar>
        <v-list-item-title class="text-h6 text-center">{{
          firstName + " " + lastName
        }}</v-list-item-title>
        <v-list-item-subtitle class="text-center">{{
          userEmail
        }}</v-list-item-subtitle>
      </v-list-item>

      <v-divider class="mb-10"></v-divider>

      <v-list class="text-center">
        <v-list-item
          link
          v-for="item in menuItems"
          :key="item.title"
          @click="handleMenuClick(item)"
        >
          <v-list-item-title class="text-h5 font-weight-medium">{{
            item.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
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
        preserving the rich cultural heritage of diverse communities.
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
import NotificationStatusAdmin from "./views/NotificationStatusAdmin.vue";
import NotificationStatusMember from "./views/NotificationStatusMember.vue";

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "./supabase";

const currentComponent = ref(null);
const drawer = ref(false);
const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const userEmail = ref("");

onMounted(() => {
  getUserData();
  refreshSession();
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
  { title: "Profile", path: "/profile" },
  { title: "Logout", action: "logout" },
];

async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (data) {
    console.log("Session refreshed:", data);
    localStorage.setItem("access_token", data.access_token); // Store the new access token
    localStorage.setItem("refresh_token", data.refresh_token); // Store the refresh token
  } else {
    console.log("Error refreshing session:", error);
  }
}

async function getUserData() {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.log("Error fetching user:", userError);
    return;
  }

  if (user) {
    userEmail.value = user.email;
    const userId = localStorage.getItem("userId") || user.id;

    if (userId) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, role")
        .eq("auth_id", userId)
        .single();

      if (profileError) {
        console.log("Error fetching profile:", profileError);
        firstName.value = "Default";
        lastName.value = "User";
      } else {
        firstName.value = profiles.first_name;
        lastName.value = profiles.last_name;

        // Store user role in localStorage
        localStorage.setItem("user_role", profiles.role);

        // Set the currentComponent based on the role
        if (profiles.role === "admin") {
          currentComponent.value = NotificationStatusAdmin;
        } else {
          currentComponent.value = NotificationStatusMember;
        }
      }
    }
  }
}

const isLandingPage = computed(() => router.currentRoute.value.path === "/");

const handleMenuClick = async (item) => {
  if (item.action === "logout") {
    await logout();
  } else if (item.path === "/status") {
    // Check the user's role and navigate accordingly
    const userId = localStorage.getItem("userId");
    if (userId) {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("auth_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        alert("Unable to determine user role.");
        return;
      }

      // Block access to /status/member for users with any role
      if (profiles.role && item.path === "/status/member") {
        alert("Users with a role cannot access the member status page.");
        router.push("/status/admin");
      } else {
        const statusPath =
          profiles.role === "admin" ? "/status/admin" : "/status/member";
        router.push(statusPath);
      }
    }
  } else {
    // Navigate to other paths
    if (router.currentRoute.value.path !== item.path) {
      router.push(item.path);
    }
  }
};

const logout = async () => {
  console.log("Logging out...");
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    console.log("User logged out");
    router.push("/");
  } catch (error) {
    console.error("Error logging out", error.message);
  }
};
</script>
