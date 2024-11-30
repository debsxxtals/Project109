<template>
  <v-app>
    <v-app-bar v-show="!isLandingPage" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Culture Closet</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-show="!isLandingPage" v-model="drawer" app>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "./supabase";

const drawer = ref(false);
const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const userEmail = ref("");

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
  { title: "Logout", action: "logout" },
];

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
        .select("first_name, last_name")
        .eq("auth_id", userId)
        .single();

      if (profileError) {
        console.log("Error fetching profile:", profileError);
        firstName.value = "Default";
        lastName.value = "User";
      } else {
        firstName.value = profiles.first_name;
        lastName.value = profiles.last_name;
      }
    }
  }
}

const isLandingPage = computed(() => router.currentRoute.value.path === "/");

const handleMenuClick = async (item) => {
  if (item.action === "logout") {
    await logout();
  } else {
    router.push(item.path);
  }
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    alert("Logging out...");
    await router.push("/");
    localStorage.clear();
  } else {
    alert("Logout failed: " + error.message);
  }
};
</script>
