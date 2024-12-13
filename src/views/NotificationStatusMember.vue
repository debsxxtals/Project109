<template>
  <v-row>
    <v-col cols="12">
      <h1 class="text-h4 font-weight-bold text-center text-white">
        Culture Closet Inventory
      </h1>
      <p class="text-center text-white mb-8">
        Explore our collection of traditional costumes and cultural attire.
      </p>
    </v-col>
    <v-col cols="12">
      <v-form @submit.prevent="handleSearch" class="d-flex align-center">
        <v-text-field
          v-model="searchKeyword"
          label="Find costume you like to borrow"
          variant="solo"
          clearable
          style="max-width: 700px"
          class="mx-auto rounded-lg"
        >
          <template v-slot:append-inner>
            <v-btn
              @click.stop="handleSearch"
              color="primary"
              icon
              density="comfortable"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-form>
    </v-col>
  </v-row>

  <v-container align="center">
    <v-list-item
      v-for="item in transactions"
      :key="item.id"
      base-color="surface-light"
      border="opacity-50 md"
      lines="two"
      max-width="1000"
      prepend-avatar="https://cdn.vuetifyjs.com/docs/images/one/logos/one.png"
      rounded="lg"
      variant="flat"
    >
      <div class="d-flex justify-space-between align-center w-100">
        <a class="text-caption">{{ item.first_name + " " + item.last_name }}</a>
        <span class="text-caption">{{ item.created_at }}</span>
      </div>

      <v-divider></v-divider>

      <div class="d-flex justify-space-between align-center w-100 mt-3">
        <v-row>
          <v-col>
            <div>
              <v-list-item-title class="text-start">
                <span class="text-subtitle-1 font-weight-bold mt-0">
                  {{ item.name }}
                </span>
              </v-list-item-title>

              <v-list-item-subtitle class="text-start">
                <div class="d-flex justify-space-between">
                  <span>Quantity: {{ item.quantity }}</span>
                  <span>Size: {{ item.size }}</span>
                </div>
              </v-list-item-subtitle>
            </div>
          </v-col>

          <v-col>
            <div class="d-flex justify-end">
              <!-- Display status instead of buttons -->

              <span
                class="text-caption font-weight-bold"
                :class="{
                  'text-warning': item.transact_status === 'Pending',
                  'text-primary': item.transact_status === 'In Use',
                  'text-error': item.transact_status === 'Overdue',
                  'text-success': item.transact_status === 'Settled',
                }"
              >
                {{ item.transact_status }}
              </span>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-list-item>
  </v-container>
</template>
<script>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase"; // Adjust the path as needed

export default {
  name: "NotificationStatusMember",
  setup() {
    const transactions = ref([]);
    const searchKeyword = ref(""); // Holds the search input
    const currentUserUniId = ref(""); // To store the current user's uni_id

    // Fetch the current user's uni_id
    const fetchCurrentUserUniId = async () => {
      const userId = localStorage.getItem("userId"); // Get the userId from localStorage

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("uni_id")
        .eq("auth_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      currentUserUniId.value = data.uni_id;
    };

    // Fetch transactions based on the search keyword
    const fetchTransactions = async (keyword) => {
      if (!currentUserUniId.value) {
        console.error("User uni_id is not available");
        return;
      }

      const { data, error } = await supabase
        .from("transaction_with_due_date")
        .select(
          `transact_id, size, quantity, created_at, date_approved, due_date, first_name, last_name, item_name, uni_id, transact_status`
        )
        .eq("uni_id", currentUserUniId.value)
        .or(`item_name.ilike.%${keyword}%,transact_status.ilike.%${keyword}%`) // Filter by both item_name and transact_status
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }

      // Fetch settled status from the 'transaction' table
      const { data: settledData, error: settledError } = await supabase
        .from("transaction")
        .select("transact_id, settled");

      if (settledError) {
        console.error("Error fetching settled status:", settledError);
        return;
      }

      // Update the transactions list with status
      transactions.value = data.map((tr) => {
        const currentDate = new Date();
        let status = "Pending"; // Default status

        if (tr.date_approved) {
          const dueDate = new Date(tr.due_date);
          if (currentDate <= dueDate) {
            status = "In Use";
          } else if (currentDate > dueDate) {
            status = "Overdue";
          }
        }

        const settledTransaction = settledData.find(
          (s) => s.transact_id === tr.transact_id
        );

        if (settledTransaction?.settled) {
          status = "Settled";
        }

        return {
          id: tr.transact_id,
          created_at: new Date(tr.created_at).toLocaleString(),
          date_approved: tr.date_approved
            ? new Date(tr.date_approved).toLocaleString()
            : null,
          due_date: tr.due_date
            ? new Date(tr.due_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })
            : null,
          transact_status: status,
          first_name: tr.first_name,
          last_name: tr.last_name,
          name: tr.item_name,
          size: tr.size,
          quantity: tr.quantity,
        };
      });
    };

    // Trigger the search when the form is submitted
    const handleSearch = (e) => {
      e.preventDefault(); // Prevent the form from submitting normally
      if (searchKeyword.value.trim() !== "") {
        fetchTransactions(searchKeyword.value); // Fetch transactions based on the entered keyword
      }
    };

    // Fetch the user's uni_id and transactions when the component mounts
    onMounted(async () => {
      await fetchCurrentUserUniId(); // Fetch the current user's uni_id
      if (currentUserUniId.value) {
        await fetchTransactions(""); // Initial fetch with an empty keyword
      }
    });

    return {
      transactions,
      searchKeyword,
      handleSearch,
    };
  },
};
</script>
