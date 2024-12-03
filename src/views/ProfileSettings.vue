<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <span class="text-h5">User Profile</span>
            </v-card-title>
            <v-card-subtitle>
              <v-row>
                <v-col cols="12">
                  <strong>First Name:</strong> {{ user.firstName }}
                </v-col>
                <v-col cols="12">
                  <strong>Last Name:</strong> {{ user.lastName }}
                </v-col>
                <v-col cols="12">
                  <strong>Email:</strong> {{ user.email }}
                </v-col>
              </v-row>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { supabase } from "@/supabase";
  
  const user = ref({
    firstName: "",
    lastName: "",
    email: "",
  });
  
  onMounted(async () => {
    // Fetch the logged-in user's data
    await getUserData();
  });
  
  const getUserData = async () => {
    const { data: userData, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }
  
    if (userData) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("auth_id", userData.id)
        .single();
  
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return;
      }
  
      user.value = {
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: userData.email,
      };
    }
  };
  </script>
  