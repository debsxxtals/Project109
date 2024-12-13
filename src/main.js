import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router/router"; // Import your router configuration

loadFonts();

//import supabase from "@/supabase.js";

//Listen for authentication state changes
// supabase.auth.onAuthStateChange((event, session) => {
//   if (session) {
//     console.log('Session onAuthStateChange:', session);
//     localStorage.setItem('access_token', session.access_token); // Store access token
//     localStorage.setItem('refresh_token', session.refresh_token); // Store refresh token
//   } else {
//     console.log('No session');
//   }
// });
// Listen for authentication state changes
// supabase.auth.onAuthStateChange(async (event, session) => {
//   if (event === "SIGNED_IN" && session) {
//     console.log("Auth state change:", event, session);

//     const user = session.user;
//     try {
//       // Insert or update user data in the database
//       const { error } = await supabase.from("users").upsert({
//         auth_id: user.id,
//         email: user.email,
//         name: user.user_metadata.full_name,
//         avatar: user.user_metadata.avatar_url,
//       });

//       if (error) {
//         console.error("Error storing user data:", error.message);
//       } else {
//         console.log("User data stored successfully");
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     }
//   } else if (event === "SIGNED_OUT") {
//     console.log("User signed out");

//     // Clear localStorage, sessionStorage, and cookies on sign-out
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     sessionStorage.clear();
//     document.cookie = "supabase.auth.token=; Max-Age=0"; // Remove Supabase auth token cookie

//     // Force page reload to ensure the UI updates after sign out
//     window.location.reload();
//   }
// });

createApp(App).use(vuetify).use(router).mount("#app");
