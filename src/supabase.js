import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://mqablnufetjbxivjsycu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYWJsbnVmZXRqYnhpdmpzeWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNTI2OTAsImV4cCI6MjA0NDYyODY5MH0.BUVprvok3y_wviIDCr1wWhkb9ceoZnhQNqfez_uHukQ";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
