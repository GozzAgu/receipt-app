<template>
  <div class="px-[1em] my-[6em]">
    <p class="text-center text-gray-50 bg-blue-400 p-[0.5em] rounded-lg mb-[1.5em] text-sm">
      Below is your product receipt
    </p>
    
    <div>
      <div class="mt-[4em] py-[2em] bg-gray-100 border border-blue-200 rounded-lg shadow-lg">
        <div class="flex gap-x-[0.5em] pt-[1em] px-[1em]">
          <img class="w-[1em] h-[1em]" src="/public/snapbill-logo.png" />
          <p class="font-bold text-[0.6em] text-sky-600">snapB!LL</p>
        </div>

        <div class="py-[1em] px-[1em] text-sm">
          <div class="flex justify-between">
            <p class="text-base font-medium">Transaction Receipt</p>
          </div>
          <hr class="my-[1em]">
          <div class="text-xs">
            <p>Dear {{ rpt.customerName }},</p>
            <p>Below are your purchase details from <span>{{ rpt.name }}</span></p>
            <p>Be sure to keep this document safe</p>
          </div>
          <div class="bg-white py-[2em] px-[1em] text-xs mt-[2em] grid grid-cols-1 gap-y-[1em]">
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Customer Name </p>
              <p>{{ rpt.customerName }}</p>
            </div>
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Product Name </p>
              <p>{{ rpt.productName }}</p>
            </div>
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Product Description </p>
              <p>{{ rpt.productDescription }}</p>
            </div>
            <div class="grid grid-cols-2 bg-white rounded-lg p-[1em]">
              <p>Product Quantity </p>
              <p>{{ rpt.productQuantity }}</p>
            </div>
          </div>

          <div class="flex justify-between mt-[3em]">
            <p class="text-xs mt-[1em]">customer sign:___________</p>
            <p class="text-xs mt-[1em]">company sign:___________</p>
          </div>

          <div class="flex w-[full] justify-between bg-white rounded-lg p-[1em] mt-[2em]">
            <p class="text-sm">Total Price </p>
            <p class="">N{{ rpt.productPrice }}</p>
          </div>
        </div>
      </div>

      <el-button class="mt-[3em]" type="primary"> Download Receipt </el-button>

    </div>
  </div>
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