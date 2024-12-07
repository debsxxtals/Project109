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
              <template v-else-if="!item.settled">
                <v-btn
                  color="success"
                  prepend-icon="mdi-update"
                  :text="item.transact_status"
                  variant="tonal"
                  class="me-2 text-none"
                  size="small"
                  flat
                  readonly
                ></v-btn>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-clipboard-arrow-bottom-outline"
                  text="Returned"
                  class="text-none"
                  size="small"
                  variant="flat"
                  flat
                  @click="returnItem(item.id)"
                ></v-btn>
              </template>
              <template v-else>
                <span class="text-caption text-primary">Settled</span>
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
  name: "NotificationStatusAdmin",
  setup() {
    const transactions = ref([]);

    // Approve transaction method
    const approveTransaction = async (transact_id) => {
      const currentDate = new Date().toISOString(); // Current date in ISO format

      try {
        // Step 1: Fetch the transaction details
        const { data: transactionData, error: transactionError } =
          await supabase
            .from("transaction")
            .select("item_id, size, quantity")
            .eq("transact_id", transact_id)
            .single();

        if (transactionError || !transactionData) {
          console.error(
            "Error fetching transaction details:",
            transactionError
          );
          alert("Failed to fetch transaction details. Please try again.");
          return;
        }

        const { item_id, size, quantity } = transactionData;

        // Step 2: Fetch the current quantity from the item_sizes table
        const { data: inventoryData, error: inventoryFetchError } =
          await supabase
            .from("item_sizes")
            .select("quantity")
            .match({ item_id, size })
            .single();

        if (inventoryFetchError || !inventoryData) {
          console.error("Error fetching inventory data:", inventoryFetchError);
          alert("Failed to fetch inventory details. Please try again.");
          return;
        }

        const updatedQuantity = inventoryData.quantity - quantity;

        if (updatedQuantity < 0) {
          alert("Insufficient stock to approve this transaction.");
          return;
        }

        // Step 3: Update the item_sizes table
        const { error: inventoryUpdateError } = await supabase
          .from("item_sizes")
          .update({ quantity: updatedQuantity })
          .match({ item_id, size });

        if (inventoryUpdateError) {
          console.error("Error updating inventory:", inventoryUpdateError);
          alert("Failed to update inventory. Please try again.");
          return;
        }

        // Step 4: Update the transaction table
        const { error: transactionUpdateError } = await supabase
          .from("transaction")
          .update({ date_approved: currentDate })
          .eq("transact_id", transact_id);

        if (transactionUpdateError) {
          console.error("Error approving transaction:", transactionUpdateError);
          alert("Failed to approve the transaction. Please try again.");
          return;
        }

        // Success feedback
        alert("Transaction approved successfully!");

        // Optionally, refresh the data
        fetchTransactions(); // Re-fetch the transaction data
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
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

    //admin
    const fetchTransactions = async () => {
      // Fetch data from the transaction_with_due_date table
      const { data, error } = await supabase
        .from("transaction_due_date")
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

      // Now fetch the settled status separately from the 'transaction' table
      const { data: settledData, error: settledError } = await supabase
        .from("transaction")
        .select("transact_id, settled");

      if (settledError) {
        console.error("Error fetching settled status:", settledError);
        return;
      }

      // Map data and include the settled status
      transactions.value = data.map((tr) => {
        // Find the settled status for the current transaction
        const settledTransaction = settledData.find(
          (s) => s.transact_id === tr.transact_id
        );

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
          transact_status:
            !tr.due_date || new Date() <= new Date(tr.due_date)
              ? "In Use"
              : "Overdue",
          first_name: tr.first_name,
          last_name: tr.last_name,
          name: tr.item_name,
          size: tr.size,
          quantity: tr.quantity,
          settled: settledTransaction ? settledTransaction.settled : false, // Add settled status from the second query
        };
      });
    };

    const returnItem = async (transactId) => {
      try {
        // Step 1: Fetch the transaction details to get item_id, size, and quantity
        const { data: transactionData, error: transactionError } =
          await supabase
            .from("transaction")
            .select("item_id, size, quantity")
            .eq("transact_id", transactId)
            .single();

        if (transactionError || !transactionData) {
          console.error(
            "Error fetching transaction details:",
            transactionError
          );
          return;
        }

        const { item_id, size, quantity } = transactionData;

        // Step 2: Fetch the current quantity of the item in the item_sizes table
        const { data: inventoryData, error: inventoryFetchError } =
          await supabase
            .from("item_sizes")
            .select("quantity")
            .match({ item_id, size })
            .single();

        if (inventoryFetchError || !inventoryData) {
          console.error("Error fetching inventory data:", inventoryFetchError);
          return;
        }

        // Step 3: Add the quantity back to the inventory
        const updatedQuantity = inventoryData.quantity + quantity;

        // Step 4: Update the item_sizes table to add the quantity back
        const { error: inventoryUpdateError } = await supabase
          .from("item_sizes")
          .update({ quantity: updatedQuantity })
          .match({ item_id, size });

        if (inventoryUpdateError) {
          console.error("Error updating inventory:", inventoryUpdateError);
          return;
        }

        // Step 5: Update the transaction table to mark the item as returned and settled
        const { error: transactionUpdateError } = await supabase
          .from("transaction")
          .update({ settled: true })
          .eq("transact_id", transactId);

        if (transactionUpdateError) {
          console.error("Error returning item:", transactionUpdateError);
          return;
        }

        // Step 6: Update the local state (UI) to reflect the change
        const transaction = transactions.value.find(
          (item) => item.id === transactId
        );
        if (transaction) {
          transaction.settled = true;

          // Save the settled status to localStorage
          localStorage.setItem(`transaction-${transactId}-settled`, "true");
        }

        console.log("Item marked as returned, quantity updated, and settled.");
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    onMounted(fetchTransactions);

    return {
      transactions,

      disapproveTransaction,
      approveTransaction,
      returnItem,
    };
  },
};
</script>
