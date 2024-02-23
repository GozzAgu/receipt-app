<template>
  <div class="px-[1em] my-[6em]">
    <p class="text-center text-gray-50 bg-sky-700 p-[0.5em] rounded-lg mb-[1.5em] text-sm">
      Below is your product receipt
    </p>
    
    <div>
      <div class="mt-[2em] h-[30em] bg-slate-100 rounded-lg shadow-lg">
        <div class="flex gap-x-[0.5em] pt-[1em] px-[1em]">
          <img class="w-[1em] h-[1em]" src="/public/snapbill-logo.png" />
          <p class="font-bold text-[0.6em] text-sky-600">snapB!LL</p>
        </div>

        <div class="py-[1em] px-[1em] text-sm">
          <div class="flex justify-between">
            <p class="text-base font-medium">Transaction Receipt</p>
            <p class="text-xs">company sign:__________</p>
          </div>
          <hr class="my-[1em]">
          <div class="text-xs">
            <p>Dear (......){{  }},</p>
            <p>Below are your purchase details from <span>(......){{  }}</span></p>
            <p>Be sure to keep this document safe</p>
          </div>
          <div class="text-xs mt-[2em] grid grid-cols-1 gap-y-[1em]">
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Customer Name </p>
              <p>....{{  }}</p>
            </div>
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Product Name </p>
              <p>....{{  }}</p>
            </div>
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Product Description </p>
              <p>....{{  }}</p>
            </div>
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Customer Quantity </p>
              <p>....{{  }}</p>
            </div>
          </div>

          <div class="flex justify-between mt-[3em]">
            <p class="text-xs mt-[1em]">customer sign:_________</p>
  
            <div class="flex w-[10em] justify-between bg-white rounded-lg p-[0.5em]">
              <p class="text-xs">Total Price </p>
              <p>....{{  }}</p>
            </div>
          </div>
        </div>
      </div>

      <button @click="" 
        class="
          rounded-lg
          mt-[2.5em] 
          bg-sky-700 
          text-gray-50 
          p-[0.5em] 
          hover:bg-sky-900"
      >
        Download Receipt
      </button>
    </div>
  </div>

  <pre>{{ rpt }}</pre>
</template>

<script setup>
import { useStore } from "../store"

const store = useStore()
const route = useRoute()

console.log(route.params.id)
const r = computed(() => {
  return route.params.id
})

const rpt = computed(() => {
  return store.receipts.find(re => re.id == r.value) || {}
})

onMounted(async () => {
  store.fetchReceipts()
  console.log(rpt.value, route.params.id)
})
 
</script>