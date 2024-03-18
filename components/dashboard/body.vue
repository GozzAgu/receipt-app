<template>
  <div class="px-[1em] pb-[3rem] md:px-[5em] lg:px-[5em] mt-[3rem] relative">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[3rem]">
      <div class="border p-[2rem] rounded-lg h-[25rem]">
        <div class="flex gap-x-[0.5rem] mb-[0.5rem]">
          <Icon class="text-2xl text-sky-600" name="ic:sharp-swap-horiz" />
          <p class="font-semibold text-sky-600">Recent swaps</p>
        </div>
        <el-table 
          :default-sort="{ prop: 'date', order: 'descending' }" 
          v-if="store.receipts.length > 0" 
          :data="filteredReceipts" 
          height="95%"
          style="width: 100%; max-height: 100%;"
        > 
          <el-table-column prop="swapFrom" label="SWAP FROM" width="130"  show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.swapFrom }} 
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="TO" width="130" show-overflow-tooltip />
          <el-table-column prop="customerName" label="CUSTOMER" width="130" show-overflow-tooltip />
          <el-table-column prop="date" sortable label="DATE" width="100"  show-overflow-tooltip />
        </el-table>
      </div>

      <div class="border p-[2rem] rounded-lg h-[25rem]">
        <div class="flex gap-x-[0.5rem] mb-[0.5rem]">
          <Icon class="text-2xl text-green-500" name="ic:twotone-loyalty" />
          <p class="font-semibold text-green-500">Patrons</p>
        </div>
        <el-table 
          :default-sort="{ prop: 'date', order: 'descending' }" 
          v-if="store.receipts.length > 0" 
          :data="filteredReceipts" 
          height="95%"
          style="width: 100%; max-height: 100%;"
        > 
          <el-table-column prop="customerName" label="CUSTOMER" width="130" show-overflow-tooltip />
          <el-table-column prop="productName" label="PRODUCT" width="130" show-overflow-tooltip />
          <el-table-column prop="newPrice" label="PRICE" width="130" show-overflow-tooltip>
            <template #default="scope">
              ₦{{ scope.row.newPrice }} 
            </template>
          </el-table-column>
          <el-table-column prop="date" sortable label="DATE" width="100"  show-overflow-tooltip />
        </el-table>
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

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-300
}
</style>