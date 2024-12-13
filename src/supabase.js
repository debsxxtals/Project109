import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://mqablnufetjbxivjsycu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYWJsbnVmZXRqYnhpdmpzeWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNTI2OTAsImV4cCI6MjA0NDYyODY5MH0.BUVprvok3y_wviIDCr1wWhkb9ceoZnhQNqfez_uHukQ";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function loginWithGoogle() {
  try {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      throw error;
    }

    // Store user data into your database (if needed)
    const { data, error: dbError } = await supabase
      .from("users") // your users table
      .upsert([
        {
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
        },
      ]);

    if (dbError) {
      throw dbError;
    }

    console.log("User data saved", data);
  } catch (error) {
    console.error("Error during Google login", error.message);
  }
}

export async function signOut() {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear session data from localStorage and sessionStorage
    localStorage.removeItem("supabase.auth.token");
    sessionStorage.removeItem("supabase.auth.token");

    // Redirect user to the login page (optional)
    window.location.href = "/login"; // or use this.$router.push('/login') if you are using Vue Router

    console.log("You have been signed out from all accounts.");
  } catch (error) {
    console.error("Error signing out from all accounts:", error.message);
  }
}

// Sign up function
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}
// Login function
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}
// Logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export default supabase;
