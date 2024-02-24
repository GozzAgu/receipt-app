<template>
  <el-input
    v-model="search"
    placeholder="Search for a receipt"
    :prefix-icon="Search"
  />

  <div class="grid grid-cols-2 gap-x-[1em] gap-y-[1.5em] mt-[2em]">
    <div v-for="card in searchR">
      <div class="bg-slate-50 border shadow-lg rounded-lg text-xs p-[1em]">
        <div class="text-gray-400">
          <div class="text-base font-medium border-b border-slate-300 text-gray-500">
            <p class="">
              {{ card.customerName }}
            </p>
            <i class="ri-delete-bin-6-line text-red-500"></i>
          </div>
          
          <p class="my-[0.5em] text-sm">{{ card.productName }}</p>
          <p class="my-[0.5em]">QTY: {{ card.productQuantity }}</p>
          <p class="my-[0.5em]">PRICE: ₦{{ card.productPrice }}</p>
        </div>

        <div class="mt-[1em]">
          <el-button @click="viewR(card.id)" type="primary" plain>
            <el-icon><Tickets /></el-icon>
            <span class="ml-[1em]">View Receipt</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../store"
import { Search, Tickets } from '@element-plus/icons-vue'

const search = ref('')
const router = useRouter()
const store = useStore()

const searchR = computed(() => {
  return store.receipts.filter(r => {
    return r.productName.toLowerCase().includes(search.value.toLowerCase());
  });
})

const viewR = (index) => {
  router.push({path:`/receipt/${index}`})
}
</script>