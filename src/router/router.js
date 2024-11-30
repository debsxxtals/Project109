import LandingPage from '../views/LandingPage.vue';
import HomePage from '@/views/HomePage.vue';
import CultureInventory from "@/views/CultureInventory.vue";
import ItemDetails from '@/views/ItemDetails.vue';
import NotificationStatus from '@/views/NotificationStatus.vue';
import { createRouter, createWebHistory } from "vue-router";

// Define your routes
const routes = [
  {
    name: 'LandingPage',
    component: LandingPage,
    path: "/",
    meta: { requiresAuth: false }, // No authentication required
  },
  {
    name: 'HomePage',
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
    path: '/item/:id',
    name: 'ItemDetails',
    component: ItemDetails,
    meta: { requiresAuth: true }, // Authentication required
  },
  {
    name: "Status",
    component: NotificationStatus,
    path: "/status",
    meta: { requiresAuth: true }, // Authentication required
  },
];

// Create the Vue Router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, 
});

// Navigation guard to check authentication status before entering protected routes
router.beforeEach((to, from, next) => {
  // If the route requires authentication and the user is not logged in (no access token)
  if (to.meta.requiresAuth && !localStorage.getItem("access_token")) {
    // Redirect to the landing page (login page)
    next('/');
  } else {
    // Allow navigation if the user is authenticated or route doesn't require authentication
    next();
  }
});

export default router; 
