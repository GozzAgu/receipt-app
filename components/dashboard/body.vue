<template>
  <div class="px-[1em] md:px-[5em] lg:px-[5em] mt-[3rem] relative">
    <div class="">
      <p class="font-semibold">Recent swaps</p>
      <div class="overflow-y-auto h-[15rem] px-[2rem] py-[1.5rem] border rounded-lg shadow-md">
        <div v-for="(receipt, index) in filteredReceipts.slice(0, 10)" :key="index">
          <div class="text-sm border rounded-lg p-[0.5rem] mb-[0.3rem]">
            <div class="flex justify-between">
              <p class="font-semibold">{{ receipt.customerName }}</p>
              <p>{{ receipt.productName }}</p>
            </div>
            <p class="text-end text-sky-600">₦{{ receipt.productPrice }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { useAuthStore } from "~/store/users"

const store = useStore()
const authStore = useAuthStore()

const filteredReceipts = computed(() => {
  return store.receipts.filter(receipt => receipt.swap === "Yes")
})

onMounted(() =>{
  store.fetchReceipts()
})
</script>