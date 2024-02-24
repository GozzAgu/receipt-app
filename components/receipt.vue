<template>
  <div class="px-[1em] py-[3em] bg-blue-50 h-[55em]">
    <div>
      <div class="mt-[4em] py-[2em] bg-white rounded-lg shadow-lg">
        <div class="flex justify-between pt-[1em] px-[1em]">
          <div class="flex gap-x-[0.5em]">
            <img class="w-[1em] h-[1em]" src="/public/snapbill-logo.png" />
            <p class="font-bold text-[0.6em] text-sky-600">snapB!LL</p>
          </div>
          <p class="text-xs">{{ rpt.date }}</p>
        </div>

        <div class="py-[1em] px-[1em] text-sm">
          <div class="flex justify-between">
            <el-divider content-position="left"><span class="text-lg">Transaction Receipt</span></el-divider>
          </div>
          <div class="text-xs">
            <p>Dear {{ rpt.customerName }},</p>
            <p>Below are your purchase details from <span>{{ rpt.name }}</span></p>
            <p>Be sure to keep this document safe</p>
          </div>
          <div class="bg-white py-[1em] border rounded-lg text-xs mt-[2em] grid grid-cols-1 gap-y-[1em] px-[0.5em]">
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Customer Name </p>
              <p>{{ rpt.customerName }}</p>
            </div>
            <hr>
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Product Name </p>
              <p>{{ rpt.productName }}</p>
            </div>
            <hr>
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Product Description </p>
              <p>{{ rpt.productDescription }}</p>
            </div>
            <hr>
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Product Quantity </p>
              <p>{{ rpt.productQuantity }}</p>
            </div>
          </div>

          <div class="flex w-[full] justify-between bg-white rounded-lg mt-[2em]">
            <p class="text-sm">Total Price </p>
            <p class="">₦{{ rpt.productPrice }}</p>
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

const r = computed(() => {
  return route.params.id
})

const rpt = computed(() => {
  return store.receipts.find(re => re.id == r.value) || {}
})

onMounted(async () => {
  store.fetchReceipts()
})
 
</script>