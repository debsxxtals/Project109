<template>
  <v-card class="mx-auto" max-width="none">
    <div class="background-container position-relative">
      <v-img
        :src="backgroundImage"
        width="100%"
        height="40vh"
        cover
        class="bg-grey-lighten-2"
      />
      <!-- Pencil button overlay for background -->
      <v-btn
        icon
        small
        style="background-color: #0b6d63; color: white;"
        class="edit-background-btn"
        @click="$refs.backgroundInput.click()"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <!-- Hidden file input for background image -->
      <input
        ref="backgroundInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="uploadBackgroundImage"
      />
    </div>

    <v-card-text class="text-center pt-0 position-relative">
      <v-avatar size="130" class="mt-n9 bg-white pa-1 profile-avatar">
        <v-img :src="profileImage" alt="Profile Picture" />
        <!-- Pencil button overlay for profile -->
        <v-btn
          icon
          small
          style="background-color: #0b6d63; color: white;"
          class="edit-avatar-btn"
          @click="$refs.profileInput.click()"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <!-- Hidden file input for profile image -->
        <input
          ref="profileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="uploadProfileImage"
        />
      </v-avatar>

      <h2 class="text-h5 mb-1 mt-4">{{ user.firstName }} {{ user.lastName }}</h2>
      <p class="mb-2">{{ user.status || "No status available" }}</p>
      <p class="mb-4">{{ user.email }}</p>
    </v-card-text>
  </v-card>
</template>



<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  status: "Hello, I'm Kingkiri fetch the info in supabase!"  // Default status
});

const profileImage = ref("/placeholder.svg?height=130&width=130");
const backgroundImage = ref("/placeholder.svg?height=200&width=800");

onMounted(async () => {
  await getUserData();
});

// Fetch user profile data from Supabase
const getUserData = async () => {
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) {
    console.error("Error fetching user data:", error);
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url, background_url, status")
    .eq("auth_id", userData.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    return;
  }

  user.value = {
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    email: userData.user.email,
    status: profile.status || "No status available"
  };

  if (profile.avatar_url) {
    profileImage.value = profile.avatar_url;
  }
  if (profile.background_url) {
    backgroundImage.value = profile.background_url;
  }
};

// Upload profile image and update profile
const uploadProfileImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const { data, error } = await uploadImage(file, "avatars");
  if (error) {
    console.error("Error uploading profile image:", error);
    return;
  }
  profileImage.value = data.publicUrl;
  await updateProfile({ avatar_url: data.publicUrl });
};

// Upload background image and update profile
const uploadBackgroundImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const { data, error } = await uploadImage(file, "backgrounds");
  if (error) {
    console.error("Error uploading background image:", error);
    return;
  }
  backgroundImage.value = data.publicUrl;
  await updateProfile({ background_url: data.publicUrl });
};

// Helper function to upload images to Supabase storage
const uploadImage = async (file, bucket) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Update profile data in the Supabase "profiles" table
const updateProfile = async (updates) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    console.error("Error getting user:", userError);
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("auth_id", userData.user.id);

  if (error) {
    console.error("Error updating profile:", error);
  }
};
</script>

<style scoped>
.background-container {
  position: relative;
  width: 100%; /* Ensure the background takes up the full width */
}

.v-card {
  width: 100%;
}

.edit-background-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  position: relative;
  border: 3px solid #0b6d63; /* Thin border with sea green color */
}

.edit-avatar-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-h5 {
  font-weight: 500;
}

.mb-2 {
  margin-bottom: 10px;
}
</style>
