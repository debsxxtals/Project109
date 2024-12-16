<template>
  <v-app>
    <v-app-bar v-show="!isLandingPage" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Culture Closet</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-if="!isLandingPage" v-model="drawer" app>
      <v-list-item class="d-flex flex-column align-center my-5">
        <!-- Bind the v-avatar image to profileImage variable -->
        <v-avatar
          :image="profileImage || '/images/default.jpg'"
          size="50"
          border="sm"
        ></v-avatar>
        <v-list-item-title class="text-h6 text-center">
          {{ firstName + " " + lastName }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-center">
          {{ userEmail }}
        </v-list-item-subtitle>
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

// Reactive properties
const firstName = ref("");
const lastName = ref("");
const profileImage = ref(""); // Define profileImage here
const userEmail = ref("");

onMounted(() => {
  getUserData();
  //refreshSession();
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

// async function refreshSession() {
//   const { data, error } = await supabase.auth.refreshSession();
//   if (data) {
//     console.log("Session refreshed:", data);
//     localStorage.setItem("access_token", data.access_token); // Store the new access token
//     localStorage.setItem("refresh_token", data.refresh_token); // Store the refresh token
//   } else {
//     console.log("Error refreshing session:", error);
//   }
// }

async function getUserData() {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.log("Error fetching user:", userError);
    return;
  }

  if (user) {
    // Get user email and ID
    userEmail.value = user.email;
    const userId = localStorage.getItem("userId") || user.id;

    if (userId) {
      // Check in profiles table for email-based logins
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, image_path, email")
        .eq("auth_id", userId)
        .single();

      if (profiles) {
        // Set first name, last name, and profile image
        firstName.value = profiles.first_name;
        lastName.value = profiles.last_name;
        userEmail.value = profiles.email;

        // Fetch image from storage bucket
        if (profiles.image_path) {
          const { data: publicUrlData } = supabase.storage
            .from("profiles") // Replace with your bucket name
            .getPublicUrl(profiles.image_path);

          profileImage.value = publicUrlData.publicUrl;
        }

        // Determine the component only for email-based login (has role)
        const userRole = profiles.role || localStorage.getItem("user_role");
        if (userRole) {
          localStorage.setItem("user_role", userRole);
          currentComponent.value =
            userRole === "admin"
              ? NotificationStatusAdmin
              : NotificationStatusMember;
        }
      } else if (profileError) {
        console.log("Error fetching profile:", profileError);
        firstName.value = "Default";
        lastName.value = "User";
        profileImage.value = "/images/default.jpg"; // Fallback
      }

      // Check in users table for Google-based logins
      const { data: googleUser, error: googleError } = await supabase
        .from("users")
        .select("name, avatar, email")
        .eq("auth_id", userId)
        .single();

      if (googleUser) {
        // Set full name from Google account
        firstName.value = googleUser.name;
        lastName.value = "";
        userEmail.value = googleUser.email; // No last name for Google users

        // Check avatar and handle bucket-stored URLs
        if (googleUser.avatar.startsWith("http")) {
          profileImage.value = googleUser.avatar;
        } else {
          const { data: avatarUrlData } = supabase.storage
            .from("avatars") // Replace with your bucket name
            .getPublicUrl(googleUser.avatar);

          profileImage.value = avatarUrlData.publicUrl;
        }

        // No role-based component for Google users
        currentComponent.value = NotificationStatusMember; // Default component
      } else if (googleError) {
        console.log("Error fetching Google user:", googleError);
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
    // Clear all session-related storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.clear();
    localStorage.clear();

    // Sign out from Supabase
    await supabase.auth.signOut();

    console.log("User logged out");
    router.push("/").catch(() => {
      window.location.href = "/";
    });
  } catch (error) {
    console.error("Error logging out", error.message);
  }
};
</script>
