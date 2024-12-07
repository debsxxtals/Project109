import LandingPage from "../views/LandingPage.vue";
import HomePage from "@/views/HomePage.vue";
import CultureInventory from "@/views/CultureInventory.vue";
import ItemDetails from "@/views/ItemDetails.vue";
import NotificationStatusAdmin from "@/views/NotificationStatusAdmin.vue";
import NotificationStatusMember from "@/views/NotificationStatusMember.vue";
import ProfileSettings from "@/views/ProfileSettings.vue";
import { createRouter, createWebHistory } from "vue-router";

// Define your routes
const routes = [
  {
    name: "LandingPage",
    component: LandingPage,
    path: "/",
    meta: { requiresAuth: false }, // No authentication required
  },
  {
    name: "HomePage",
    component: HomePage,
    path: "/home",
    meta: { requiresAuth: true }, // Authentication required
  },
  {
    name: "CultureInventory",
    component: CultureInventory,
    path: "/inventory",
    meta: { requiresAuth: true }, // Authentication required
  },
  {
    path: "/item/:id",
    name: "ItemDetails",
    component: ItemDetails,
    props: true,
    meta: { requiresAuth: true }, // Authentication required
  },
  {
    path: '/status/admin',
    name: 'NotificationStatusAdmin',
    component: NotificationStatusAdmin,
    meta: { requiresRole: 'admin', requiresAuth: true },
  },
  {
    path: '/status/member',
    name: 'NotificationStatusMember',
    component: NotificationStatusMember,
    meta: { requiresRole: null, requiresAuth: true },
  },
  {
    name: "Profile",
    component: ProfileSettings,
    path: "/profile",
    meta: { requiresAuth: true }, // Authentication required
  },
];

// Create the Vue Router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication status before entering protected routes
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem("access_token"); // Check if the user is authenticated
  const role = localStorage.getItem("role"); // Retrieve role from localStorage
  console.log(role);
  // If the user is authenticated and tries to access the landing page, redirect to home
  if (to.path === "/" && isAuthenticated) {
    next("/home");
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to landing page if authentication is required but not authenticated
    next("/");
  } else if (to.path === "/status/member" && role === 'admin') {
    // If the user has any role, block access to /status/member
    alert("Users with any role cannot access the member status page.");
    next("/status/admin"); // Redirect to home page if user has a role
  } else if (to.meta.requiresRole) {
    // If the route requires a specific role, check if the role matches
    if (to.meta.requiresRole === role) {
      next(); // Allow access if the role matches
    } else {
      // Block access for other roles trying to access restricted routes
      alert("Access Denied: Insufficient permissions.");
      next(from.path);
    }
  } else {
    // Allow navigation for routes that don't require roles
    next();
  }
});


export default router;
