<template>
  <div style="min-height: 100vh" fluid class="align-center" id="login">
    <v-row class="mt-sm-16">
      <v-col cols="12" sm="6" order-sm="2">
        <v-container
          class="d-block flex-column mt-sm-5 justify-center align-center mx-auto pt-5"
        >
          <v-img
            src="../assets/dance.svg"
            alt="Logo"
            max-width="200"
            max-height="200"
            class="mx-auto my-1 mt-sm-16 pt-sm-16"
            contain
          ></v-img>

          <v-card-text
            class="px-10 text-subtitle-1 font-weight-medium text-center text-white mt-2"
          >
            Explore cultures and borrow authentic costumes, fostering cultural
            awareness through hands-on experiences.
          </v-card-text>
        </v-container>
      </v-col>

      <!-- Form Column -->
      <v-col cols="12" sm="6" order-sm="1">
        <v-card
          class="pa-3 ma-4 floating-card text-black"
          fluid
          elevation="8"
          rounded="lg"
        >
          <v-card-title
            class="text-h5 mt-10 font-weight-bold font-weight-medium mb-0 pb-0 text-center"
          >
            Connect with us
          </v-card-title>
          <v-card-text class="text-center text-body-2 mt-0 pt-0 mb-4">
            Enter your credential to login</v-card-text
          >

          <v-card-text>
            <!-- Notification Alert -->
            <v-alert
              v-if="currentCard === 'login' && notificationMessage"
              :type="notificationType"
              class="mb-4"
              border="start"
              elevation="2"
              prominent
              dismissible
              @click:close="clearNotification"
            >
              <span v-html="notificationMessage"></span>
            </v-alert>

            <!-- Login Form -->
            <v-form ref="loginForm" @submit.prevent="handleLogin">
              <div class="text-subtitle-1 text-black">Account</div>

              <v-text-field
                density="compact"
                placeholder="Email address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                v-model="emailL"
                :rules="[rules.validEmail]"
                required
              ></v-text-field>

              <div
                class="text-subtitle-1 text-black d-flex align-center justify-space-between"
              >
                Password
                <a
                  class="text-caption text-decoration-none text-cyan-lighten-1 text-end"
                  href="#"
                >
                  Forgot login password?
                </a>
              </div>

              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                v-model="passwordL"
                :rules="[rules.required]"
                @click:append-inner="togglePasswordVisibility"
              ></v-text-field>

              <v-btn
                class="my-10 text-uppercase"
                color="primary"
                size="large"
                variant="elevated"
                block
                :loading="loading"
                type="submit"
              >
                Login
              </v-btn>

              <v-card-text class="text-center">
                <span class="d-block">Don't have an account?</span>
                <a
                  class="text-cyan-lighten-1 text-decoration-none"
                  @click="scrollToSection('register')"
                >
                  Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
              </v-card-text>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <!--SIGNUP-->
  <div style="min-height: 100vh" id="register" fluid>
    <v-container justify="center" align="center">
      <!-- Form Column -->

      <v-card
        class="pa-3 ma-sm-4 floating-card text-black"
        fluid
        elevation="8"
        rounded="lg"
        max-width="800px"
      >
        <v-card-title
          class="text-h6 font-weight-bold text-sm-h5 mt-5 font-weight-medium mb-0 pb-0 text-center"
        >
          Create an account
        </v-card-title>

        <v-card-text class="text-center text-body-2 mt-0 pt-0 mb-3">
          Hey enter your details to create an account
        </v-card-text>

        <v-alert
          v-if="currentCard === 'register' && notificationMessage"
          :type="notificationType"
          class="mb-4"
          border="start"
          elevation="2"
          prominent
          dismissible
          @click:close="clearNotification"
        >
          <span v-html="notificationMessage"></span>
        </v-alert>

        <v-card-text>
          <v-form @submit.prevent="handleSignUp" v-model="isFormValid">
            <v-row class="mx-auto my-2">
              <v-col cols="12" sm="6" class="ma-0 py-0">
                <v-text-field
                  density="compact"
                  label="First Name"
                  variant="outlined"
                  v-model="firstName"
                  :rules="[rules.required]"
                  class="mb-1"
                  :class="{ 'text-start': true }"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Last Name"
                  variant="outlined"
                  v-model="lastName"
                  :rules="[rules.required]"
                  class="mb-1"
                  :class="{ 'text-start': true }"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="ID Number"
                  variant="outlined"
                  v-model="idNumber"
                  :rules="[rules.required, rules.idNumberValidation]"
                  class="mb-1"
                  :class="{ 'text-start': true }"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" class="ma-0 py-0">
                <v-text-field
                  density="compact"
                  label="Email Address"
                  variant="outlined"
                  v-model="email"
                  :rules="[rules.required, rules.validEmail]"
                  type="email"
                  class="mb-1"
                  :class="{ 'text-start': true }"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Password"
                  variant="outlined"
                  v-model="password"
                  hint="Tips: Use a mix of letters, numbers, and symbols"
                  :rules="[rules.required, rules.validPassword]"
                  type="password"
                  class="mb-1"
                  :class="{ 'text-start': true }"
                ></v-text-field>

                <v-text-field
                  density="compact"
                  label="Confirm Password"
                  variant="outlined"
                  v-model="confirmPassword"
                  :rules="[
                    rules.required,
                    () =>
                      password === confirmPassword || 'Passwords do not match.',
                  ]"
                  type="password"
                  class="mb-1"
                  :class="{ 'text-start': true }"
                ></v-text-field>
              </v-col>

              <v-btn
                color="primary"
                class="my-10 mx-auto"
                size="large"
                variant="elevated"
                type="submit"
                :disabled="!isFormValid || isSubmitting"
              >
                <template v-if="isSubmitting">
                  <v-icon icon="mdi-loading" spin></v-icon>
                  Loading...
                </template>
                <template v-else> REGISTER </template>
              </v-btn>
            </v-row>

            <v-card-text class="text-center">
              <span class="d-block">Have an account?</span>
              <a
                class="text-cyan-lighten-1 text-decoration-none"
                @click="scrollToSection('login')"
              >
                Log in now <v-icon icon="mdi-chevron-right"></v-icon>
              </a>
            </v-card-text>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { supabase } from "../supabase";

export default {
  data() {
    return {
      loading: false,
      firstName: "",
      lastName: "",
      idNumber: "",
      email: "",
      password: "",
      emailL: "",
      passwordL: "",
      confirmPassword: "",
      isSubmitting: false,
      isFormValid: false,
      visible: false,
      notificationMessage: "",
      notificationType: "",
      currentCard: "login", // 'success' or 'error'
      rules: {
        required: (value) => !!value || "This field is required.",
        validEmail: (value) =>
          /.+@.+\..+/.test(value) || "Please enter a valid email.",
        validPassword: (value) =>
          value.length >= 8 || "Password must be at least 8 characters.",
        idNumberValidation: (value) => {
          const regex = /^\d{3}-\d{5}$/;
          return regex.test(value)
            ? true
            : "This field must be a valid ID number with the format xxx-xxxxx.";
        },
      },
    };
  },

  methods: {
    togglePasswordVisibility() {
      this.visible = !this.visible;
    },

    async handleLogin() {
      this.loading = true;
      this.clearNotification();
      this.currentCard = "login";

      try {
        // Supabase sign-in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.emailL,
          password: this.passwordL,
        });

        if (error) throw error;

        const { session, user } = data;

        // Store tokens and user details
        if (session) {
          localStorage.setItem("access_token", session.access_token);
          localStorage.setItem("refresh_token", session.refresh_token);
          localStorage.setItem("userId", user.id);

          // Fetch user profile
          const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_id", user.id);
            

          if (profileError) throw profileError;

          if (profiles.length > 0) {
            localStorage.setItem("role", profiles[0].role);

            // Success Notification
            this.notificationMessage = "Login Successful. Redirecting...";
            this.notificationType = "success";

            // Redirect to dashboard
            setTimeout(() => {
              this.$router.push("/home");
            }, 1000);
          } else {
            throw new Error("User profile not found.");
          }
        } else {
          throw new Error("Session is null.");
        }
      } catch (error) {
        console.error(error);
        this.notificationMessage =
          "Login failed. Please check your credentials.";
        this.notificationType = "error";
      } finally {
        this.loading = false;
        this.$refs.loginForm.reset();
      }
    },

    async handleSignUp() {
      this.isSubmitting = true;
      this.currentCard = "register";

      try {
        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
        });

        if (error) {
          this.showNotification(
            "Registration failed: " + error.message,
            "error"
          );
          return;
        }

        if (!data.user || !data.user.id) {
          this.showNotification(
            "User creation failed: User ID is missing.",
            "error"
          );
          console.error("User data is invalid:", data);
          return;
        }

        // Insert user profile
        const user_id = data.user.id;
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            first_name: this.firstName,
            last_name: this.lastName,
            uni_id: this.idNumber,
            auth_id: user_id,
          },
        ]);

        if (profileError) {
          this.showNotification(
            "Profile creation failed: " + profileError.message,
            "error"
          );
        } else {
          this.showNotification(
            `Registration successful! Please <a href="#login" @click.prevent="scrollToSection('login')">log in</a>.`,
            "success"
          );
          this.firstName = "";
          this.lastName = "";
          this.idNumber = "";
          this.email = "";
          this.password = "";
          this.confirmPassword = "";
        }
      } catch (error) {
        this.showNotification(
          "Something went wrong: " + error.message,
          "error"
        );
      } finally {
        this.isSubmitting = false;
      }
    },
    showNotification(message, type, action = null) {
      this.notificationMessage = message;
      this.notificationType = type;
      this.notificationAction = action; // Optional action if needed

      // Auto-clear notification after 5 seconds
      setTimeout(() => {
        this.clearNotification();
      }, 30000);
    },
    clearNotification() {
      this.notificationMessage = "";
      this.notificationType = "";
      this.notificationAction = null;
    },
    scrollToSection(section) {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
.floating-card {
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.v-text-field {
  border-radius: 10px;
}

.v-btn {
  border-radius: 8px;
  font-weight: bold;
}

.v-img {
  max-width: 200px;
  max-height: 200px;

  display: block !important;
}

.grid-container {
  display: grid;
  place-items: center;
  height: 100vh; /* Example height */
}
</style>
