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
      <v-autocomplete
        :items="items"
        class="mx-auto rounded-lg"
        density="comfortable"
        menu-icon=""
        placeholder="Find costume you like to borrow"
        append-inner-icon="mdi-magnify"
        style="max-width: 700px"
        theme="light"
        variant="solo"
        item-props
        clearable
      ></v-autocomplete>
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
              <template v-if="!item.date_approved">
                <v-btn
                  color="success"
                  prepend-icon="mdi-close"
                  text="Disapprove"
                  variant="tonal"
                  class="me-2 text-none"
                  size="small"
                  flat
                  @click="disapproveTransaction(item.id)"
                ></v-btn>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-check"
                  text="Approve"
                  class="text-none"
                  size="small"
                  variant="flat"
                  flat
                  @click="approveTransaction(item.id)"
                ></v-btn>
              </template>
              <template v-else>
                <span> Due Date: {{ item.due_date }}</span>
              </template>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-list-item>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase"; // Adjust path as necessary

export default {
  name: "NotificationStatus",
  setup() {
    const transactions = ref([]);

    // Approve transaction method
    const approveTransaction = async (transact_id) => {
      const currentDate = new Date().toISOString(); // Get current date in ISO format

      // Update the transaction table
      const { error } = await supabase
        .from("transaction")
        .update({ date_approved: currentDate })
        .eq("transact_id", transact_id); // Match the transaction by ID

      if (error) {
        console.error("Error updating transaction:", error);
        alert("Failed to approve the transaction. Please try again.");
        return;
      }

      // Optional: Provide feedback to the user
      alert("Transaction approved successfully!");

      // Optionally, refresh the data (if needed)
      fetchTransactions(); // Re-fetch the transaction data
    };

    const disapproveTransaction = async (transactId) => {
      const { error } = await supabase
        .from("transaction")
        .delete()
        .eq("transact_id", transactId); // Deleting the transaction by its ID

      if (error) {
        console.error("Error disapproving transaction:", error);
        return;
      }

      // Optionally, remove the transaction from the local data array after successful deletion
      transactions.value = transactions.value.filter(
        (item) => item.id !== transactId
      );
      console.log("Transaction disapproved and deleted successfully.");
    };

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transaction_with_due_date")
        .select(
          `
      transact_id,
      size,
      quantity,
      created_at,
      date_approved,
      due_date,
      first_name,
      last_name,
      item_name
    `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }

      // Map data for easier template usage
      transactions.value = data.map((tr) => ({
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
        first_name: tr.first_name,
        last_name: tr.last_name,
        name: tr.item_name,
        size: tr.size,
        quantity: tr.quantity,
      }));
    };

    onMounted(fetchTransactions);

    return {
      transactions,

      disapproveTransaction,
      approveTransaction,
    };
  },
};
</script>
