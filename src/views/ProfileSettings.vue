<template>
  <v-card class="mx-auto" max-width="none">
    <div>
      <v-sheet
        v-if="previewImage"
        class="mt-2"
        elevation="2"
        style="background-color: #f5f5f5; padding: 10px"
      >
        <v-row>
          <v-col class="ma-auto">
            <!-- Save Changes button -->
            <v-btn color="primary" @click="saveCoverPhoto" block>
              Save Changes
            </v-btn>
          </v-col>
          <v-col>
            <!-- Cancel button -->
            <v-btn color="secondary" @click="cancelChanges" block>
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- File input -->
      <v-file-input
        ref="backgroundInput"
        accept="image/*"
        hide-input
        label="Select Cover Photo"
        @change="onFileSelect"
        prepend-icon=""
        hide-details
      >
        <template v-slot:append>
          <!-- Pencil button, visible only if no file is selected -->
          <v-btn
            v-if="!previewImage"
            icon
            color="primary"
            @click="$refs.backgroundInput.click()"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-file-input>

      <!-- Image preview -->
      <div class="preview-container">
        <v-img
          v-if="user.coverPhoto"
          :src="user.coverPhoto"
          width="100%"
          height="40vh"
          cover
        ></v-img>
      </div>

      <!-- Snackbar -->
      <v-snackbar
        v-model="snackbarVisible"
        :color="snackbarColor"
        timeout="3000"
      >
        {{ snackbarMessage }}
      </v-snackbar>
    </div>

    <v-card-text class="text-center pt-0 position-relative">
      <v-avatar size="130" class="mt-n9 bg-white pa-1 profile-avatar">
        <!-- Display profile image -->
        <img
          v-if="user.profileImage"
          :src="user.profileImage"
          alt="Profile Image"
          class="rounded-circle"
        />
        <!-- Fallback if no profile image -->
        <img
          v-else
          src="/path/to/default/profile/image.jpg"
          alt="Default Profile Image"
          class="rounded-circle"
        />

        <!-- Pencil button to open dialog -->
        <v-btn
          icon
          small
          style="background-color: #0b6d63; color: white"
          class="edit-avatar-btn"
          @click="showDialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-avatar>

      <!-- Profile Image Update Dialog -->
      <v-dialog v-model="showDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h6"
            >Change Profile Picture & Info</v-card-title
          >
          <v-card-text>
            <div class="text-center">
              <!-- Image Preview -->
              <v-avatar size="150">
                <v-img
                  v-if="selectedFiles"
                  :src="previewImages"
                  alt="Selected Image Preview"
                />
                <v-img
                  v-else
                  src="default-avatar.png"
                  alt="Default Image Preview"
                />
              </v-avatar>

              <!-- File Input Button -->
              <v-btn
                class="mt-3"
                color="primary"
                outlined
                @click="triggerFileInput"
              >
                Choose Image
              </v-btn>

              <!-- Hidden file input -->
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleFileChange"
              />
            </div>

            <v-divider class="mt-3"></v-divider>

            <!-- Form Inputs for Profile Information -->
            <v-form>
              <!-- First Name -->
              <v-text-field
                v-model="user.firstName"
                label="First Name"
                outlined
                required
              />

              <!-- Last Name -->
              <v-text-field
                v-model="user.lastName"
                label="Last Name"
                outlined
                required
              />

              <!-- Program -->
              <v-text-field
                v-model="user.program"
                label="Program"
                outlined
                required
              />

              <!-- Year Level -->
              <v-text-field
                v-model="user.yearLevel"
                label="Year Level"
                outlined
                required
              />

              <!-- Contact Number -->
              <v-text-field
                v-model="user.contactNumber"
                label="Contact Number"
                outlined
                required
              />

              <!-- Address -->
              <v-textarea
                v-model="user.address"
                label="Address"
                outlined
                required
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" @click="saveProfileImage">Save</v-btn>
            <v-btn color="red" text @click="showDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div>
        <!-- Display full name and idNumber dynamically -->
        <h2 class="text-h5 mb-1 mt-4">
          <!-- Show first and last name for email login -->
          <span v-if="user.firstName && user.lastName">
            {{ user.firstName }} {{ user.lastName }}
          </span>
          <!-- Show full name for Google login -->
          <span v-else>
            {{ user.fullName }}
          </span>
        </h2>
        <!-- Display idNumber only for email login -->
        <p v-if="user.idNumber" class="mb-2">{{ user.idNumber }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

//const image = ref(null);

const previewImage = ref(null); // For previewing the image
const selectedFile = ref(null); // For storing the selected file
const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");
const selectedFiles = ref(null); // Stores the selected file
const previewImages = ref("");

// File selection handler
const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) {
    snackbarMessage.value = "No file selected.";
    snackbarColor.value = "red";
    snackbarVisible.value = true;
    return;
  }

  if (!file.type.startsWith("image/")) {
    snackbarMessage.value = "Invalid file type. Please select an image.";
    snackbarColor.value = "red";
    snackbarVisible.value = true;
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    snackbarMessage.value = "File size exceeds 5MB.";
    snackbarColor.value = "red";
    snackbarVisible.value = true;
    return;
  }

  // Set the preview and store the file
  previewImage.value = URL.createObjectURL(file);
  selectedFile.value = file;
  snackbarMessage.value = "File selected! You can now save changes.";
  snackbarColor.value = "green";
  snackbarVisible.value = true;
};

const saveCoverPhoto = async () => {
  if (!selectedFile.value) {
    snackbarMessage.value = "No file to upload.";
    snackbarColor.value = "red";
    snackbarVisible.value = true;
    return;
  }

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      snackbarMessage.value = "User not authenticated.";
      snackbarColor.value = "red";
      snackbarVisible.value = true;
      return;
    }

    const fileName = `${userId}/cover-photo-${Date.now()}-${
      selectedFile.value.name
    }`;
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(fileName, selectedFile.value);

    if (error) {
      console.error("Upload error:", error);
      snackbarMessage.value = "Failed to upload cover photo.";
      snackbarColor.value = "red";
      snackbarVisible.value = true;
      return;
    }

    const imagePath = data.path;

    // Check if the user exists in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("uni_id")
      .eq("auth_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking profiles table:", profileError);
      snackbarMessage.value = "An error occurred.";
      snackbarColor.value = "red";
      snackbarVisible.value = true;
      return;
    }

    if (profileData) {
      // User found in profiles table (email login)
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ cover_photo: imagePath })
        .eq("auth_id", userId);

      if (dbError) {
        console.error("Database update error:", dbError);
        snackbarMessage.value = "Failed to update the database.";
        snackbarColor.value = "red";
        snackbarVisible.value = true;
        return;
      }

      snackbarMessage.value = "Cover photo updated successfully!";
      snackbarColor.value = "green";
      snackbarVisible.value = true;
    } else {
      // User not found in profiles table, check users table for Google login
      const { error: userDbError } = await supabase
        .from("users")
        .update({ cover_photo: imagePath })
        .eq("auth_id", userId);

      if (userDbError) {
        console.error("Database update error:", userDbError);
        snackbarMessage.value = "Failed to update the database.";
        snackbarColor.value = "red";
        snackbarVisible.value = true;
        return;
      }

      snackbarMessage.value = "Cover photo updated successfully!";
      snackbarColor.value = "green";
      snackbarVisible.value = true;
    }

    // Clear the preview and selected file
    previewImage.value = null;
    selectedFile.value = null;

    // Reload the page to reflect the changes
    window.location.reload();
  } catch (err) {
    console.error("Unexpected error:", err);
    snackbarMessage.value = "An unexpected error occurred.";
    snackbarColor.value = "red";
    snackbarVisible.value = true;
  }
};

const cancelChanges = () => {
  previewImage.value = null; // Clear the preview image
  snackbarMessage.value = "Changes canceled.";
  snackbarColor.value = "info"; // You can set an info color here
  snackbarVisible.value = true; // Show snackbar
};

const showDialog = ref(false); // Controls the dialog visibility

const profileImage = ref("default-avatar.png"); // Current profile image

const triggerFileInput = () => {
  // Trigger the hidden file input
  document.getElementById("fileInput").click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  // Stores the preview image URL
  if (file) {
    selectedFiles.value = file;
    previewImages.value = URL.createObjectURL(file); // Create a preview URL
  }
};

const saveProfileImage = async () => {
  if (!selectedFiles.value) {
    alert("Please select an image."); // Replace with snackbar in actual implementation
    return;
  }

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not authenticated."); // Replace with snackbar
      return;
    }

    // File upload logic
    const fileName = `${userId}/profile-photo-${Date.now()}-${
      selectedFiles.value.name
    }`;
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(fileName, selectedFiles.value);

    if (error) {
      console.error("Upload error:", error);
      alert("Failed to upload the image."); // Replace with snackbar
      return;
    }

    const imagePath = data.path;

    // Fetch the user's profile data to determine the login type
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(
        "uni_id, first_name, last_name, program, year_level, contact_number, address"
      )
      .eq("auth_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking profiles table:", profileError);
      alert("An error occurred while fetching profile data."); // Replace with snackbar
      return;
    }

    // Update both tables
    if (profileData) {
      // Profile table update with full information (including profile image)
      const { error: profileDbError } = await supabase
        .from("profiles")
        .update({
          first_name: user.value.firstName,
          last_name: user.value.lastName,
          program: user.value.program,
          year_level: user.value.yearLevel,
          contact_number: user.value.contactNumber,
          address: user.value.address,
          image_path: imagePath,
        })
        .eq("auth_id", userId);

      if (profileDbError) {
        console.error("Profile table update error:", profileDbError);
        alert("Failed to update the profiles table."); // Replace with snackbar
        return;
      }

      alert("Profile updated successfully!"); // Replace with snackbar
    } else {
      // If profile doesn't exist, handle Gmail login update

      const fullName = user.value.firstName + " " + user.value.lastName;

      const { error: userDbError } = await supabase
        .from("users")
        .update({
          name: fullName,

          avatar: imagePath,
        })
        .eq("auth_id", userId);

      if (userDbError) {
        console.error("Users table update error:", userDbError);
        alert("Failed to update the users table."); // Replace with snackbar
        return;
      }

      alert("Profile updated successfully!"); // Replace with snackbar
    }

    // Update the displayed profile image
    profileImage.value = imagePath;
    showDialog.value = false;
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred."); // Replace with snackbar
  }
};

const user = ref({
  firstName: "",
  lastName: "",
  idNumber: "",
  fullName: "",
  profileImage: "",
  coverPhoto: "",
  program: "",
  year_level: "",
  contact_number: "",
  address: "",
});

const fetchUserData = async () => {
  try {
    const userId = localStorage.getItem("userId"); // Get the user's unique identifier
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    // Check if the user exists in the profiles table
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_id", userId)
      .single();

    if (profileData) {
      // Email login: Populate user object with profiles table data
      user.value.firstName = profileData.first_name;
      user.value.lastName = profileData.last_name;
      user.value.idNumber = profileData.uni_id;

      // Get public URL for the profile image in the storage bucket
      if (profileData.image_path) {
        const { data: imageUrlData } = supabase.storage
          .from("profiles") // Replace with your bucket name
          .getPublicUrl(profileData.image_path);
        user.value.profileImage = imageUrlData.publicUrl;
      }

      // Get public URL for the cover photo if available
      if (profileData.cover_photo) {
        const { data: coverPhotoUrlData } = supabase.storage
          .from("profiles") // Replace with your bucket name
          .getPublicUrl(profileData.cover_photo);
        user.value.coverPhoto = coverPhotoUrlData.publicUrl;
      }
    } else {
      // If not found in profiles, check in users table
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", userId)
        .single();

      if (userData) {
        // Google login: Populate user object with users table data
        user.value.fullName = userData.name;

        // Check if avatar is a URL or bucket path
        if (userData.avatar.startsWith("http")) {
          // Use the URL directly if it's a Google avatar
          user.value.profileImage = userData.avatar;
        } else {
          // If avatar is saved in the bucket, get its public URL
          const { data: avatarUrlData } = supabase.storage
            .from("avatars") // Replace with your bucket name
            .getPublicUrl(userData.avatar);
          user.value.profileImage = avatarUrlData.publicUrl;
        }

        // Get public URL for the cover photo if available in the users table
        if (userData.cover_photo) {
          const { data: coverPhotoUrlData } = supabase.storage
            .from("avatars") // Replace with your bucket name
            .getPublicUrl(userData.cover_photo);
          user.value.coverPhoto = coverPhotoUrlData.publicUrl;
        }
      } else {
        console.error("User not found in profiles or users table.");
      }
    }
  } catch (err) {
    console.error("Unexpected error fetching user data:", err);
  }
};

// Fetch user data on component mount
onMounted(fetchUserData);
// Fetch user profile data from Supabase
// const getUserData = async () => {
//   const { data: userData, error } = await supabase.auth.getUser();
//   if (error || !userData.user) {
//     console.error("Error fetching user data:", error);
//     return;
//   }

//   const { data: profile, error: profileError } = await supabase
//     .from("profiles")
//     .select("first_name, last_name, avatar_url, background_url, status")
//     .eq("auth_id", userData.user.id)
//     .single();

//   if (profileError) {
//     console.error("Error fetching user profile:", profileError);
//     return;
//   }

//   user.value = {
//     firstName: profile.first_name || "",
//     lastName: profile.last_name || "",
//     email: userData.user.email,
//     status: profile.status || "No status available",
//   };

//   if (profile.avatar_url) {
//     profileImage.value = profile.avatar_url;
//   }
//   if (profile.background_url) {
//     backgroundImage.value = profile.background_url;
//   }
// };

// Upload profile image and update profile
// const uploadProfileImage = async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   const { data, error } = await uploadImage(file, "avatars");
//   if (error) {
//     console.error("Error uploading profile image:", error);
//     return;
//   }
//   profileImage.value = data.publicUrl;
//   await updateProfile({ avatar_url: data.publicUrl });
// };

// Upload background image and update profile
// const uploadBackgroundImage = async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   const { data, error } = await uploadImage(file, "backgrounds");
//   if (error) {
//     console.error("Error uploading background image:", error);
//     return;
//   }
//   backgroundImage.value = data.publicUrl;
//   await updateProfile({ background_url: data.publicUrl });
// };

// Helper function to upload images to Supabase storage

// Update profile data in the Supabase "profiles" table
// const updateProfile = async (updates) => {
//   const { data: userData, error: userError } = await supabase.auth.getUser();
//   if (userError || !userData.user) {
//     console.error("Error getting user:", userError);
//     return;
//   }

//   const { error } = await supabase
//     .from("profiles")
//     .update(updates)
//     .eq("auth_id", userData.user.id);

//   if (error) {
//     console.error("Error updating profile:", error);
//   }
// };
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
