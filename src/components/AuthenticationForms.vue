<template>
  <div style="min-height: 100vh" fluid class="align-center" id="login">
    <v-row class="mt-sm-16">
      <v-col cols="12" sm="6" order-sm="2">
        <container
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
        </container>
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
            <v-form>
              <div class="text-subtitle-1 text-black">Account</div>

              <v-text-field
                density="compact"
                placeholder="Email address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                v-model="email"
                :rules="[rules.required]"
                type="email"
              ></v-text-field>

              <div
                class="text-subtitle-1 text-black d-flex align-center justify-space-between"
              >
                Password

                <a
                  class="text-caption text-decoration-none text-cyan-lighten-1 text-end"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Forgot login password?</a
                >
              </div>

              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                v-model="password"
                :rules="[rules.required]"
                @click:append-inner="visible = !visible"
              ></v-text-field>

              <v-btn
                class="my-10 text-uppercase"
                color="primary"
                size="large"
                variant="elevated"
                block
                @click="handleLogin"
              >
                Login
              </v-btn>

              <v-card-text class="text-center">
                <span class="d-block">Don't have an account?</span>
                <a
                  class="text-cyan-lighten-1 text-decoration-none"
                  @click="scrollToSection('register')"
                  rel="noopener noreferrer"
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
    <v-container>
      <!-- Form Column -->

      <v-card
        class="pa-3 ma-sm-4 floating-card text-black"
        fluid
        elevation="8"
        rounded="lg"
      >
        <v-card-title
          class="text-h6 font-weight-bold text-sm-h5 mt-5 font-weight-medium mb-0 pb-0 text-center"
        >
          Create an account
        </v-card-title>

        <v-card-text class="text-center text-body-2 mt-0 pt-0 mb-3">
          Hey enter your details to create an account
        </v-card-text>

        <v-card-text>
          <v-form>
            <v-row class="mx-auto my-2">
              <v-col cols="12" sm="6" class="ma-0 py-0">
                <v-text-field
                  density="compact"
                  label="First Name"
                  variant="outlined"
                  v-model="firstName"
                  :rules="[rules.required]"
                  class="mb-1"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Last Name"
                  variant="outlined"
                  v-model="lastName"
                  :rules="[rules.required]"
                  class="mb-1"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Program"
                  placeholder="BSIT"
                  variant="outlined"
                  v-model="program"
                  :rules="[rules.required]"
                  class="mb-1"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Year Level"
                  placeholder="1"
                  variant="outlined"
                  v-model="yearLevel"
                  :rules="[rules.required]"
                  class="mb-1"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" class="ma-0 py-0">
                <v-text-field
                  density="compact"
                  label="ID Number"
                  variant="outlined"
                  v-model="idNumber"
                  :rules="[rules.required]"
                  class="mb-1"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Email Address"
                  variant="outlined"
                  v-model="email"
                  :rules="[rules.required]"
                  type="email"
                  class="mb-1"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Password"
                  variant="outlined"
                  v-model="password"
                  hint="Tips: Use a mix of letters, numbers, and symbols"
                  :rules="[rules.required]"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  @click:append-inner="visible = !visible"
                  class="mb-1"
                ></v-text-field>
                <v-text-field
                  density="compact"
                  label="Confirm Password"
                  variant="outlined"
                  v-model="confirmPassword"
                  :rules="[rules.required]"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  @click:append-inner="visible = !visible"
                  class="mb-1"
                ></v-text-field>
              </v-col>

              <v-btn
                color="primary "
                @click="handleSignUp"
                class="my-10 mx-auto"
                size="large"
                variant="elevated"
                block
              >
                REGISTER
              </v-btn>
            </v-row>

            <v-card-text class="text-center">
              <span class="d-block">Have an account?</span>
              <a
                class="text-cyan-lighten-1 text-decoration-none"
                @click="scrollToSection('login')"
                rel="noopener noreferrer"
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
import { useRouter } from "vue-router";

import { ref } from "vue";
import { signUp, login, logout } from "../supabase";

export default {
  data: () => ({
    visible: false,
    rules: {
      required: (value) => !!value || "Field is required",
    },
  }),
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
  },

  setup() {
    const email = ref("");
    const password = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const program = ref("");
    const yearLevel = ref("");
    const idNumber = ref("");
    const confirmPassword = ref("");
    const router = useRouter();

    const handleSignUp = async () => {
      const { error } = await signUp(email.value, password.value);
      if (error) {
        alert(`Sign Up Error: ${error.message}`);
      } else {
        alert("Sign Up Successful");
      }
    };

    const handleLogin = async () => {
      const { error } = await login(email.value, password.value);
      if (error) {
        alert(`Login Error: ${error.message}`);
      } else {
        alert("Login Successful");
        router.push({ name: "HomePage" });
      }
    };

    const handleLogout = async () => {
      const { error } = await logout();
      if (error) {
        alert(`Logout Error: ${error.message}`);
      } else {
        alert("Logged Out Successfully");
      }
    };

    return {
      email,
      password,
      firstName,
      lastName,
      program,
      yearLevel,
      idNumber,
      confirmPassword,
      handleSignUp,
      handleLogin,
      handleLogout,
      login,
    };
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
