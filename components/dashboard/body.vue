<template>
  <div class="px-[1em] pb-[3rem] sm:px-[5em] lg:px-[5em] mt-[3rem] relative">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[3rem]">
      <div class="shadow-md shadow-slate-100 drop-shadow-sm bg-white border-t p-[1rem] rounded-xl h-[25rem]">
        <div class="flex gap-x-[0.5rem] mb-[1rem]">
          <Icon class="text-2xl text-sky-600" name="ic:sharp-swap-horiz" />
          <p class="font-semibold text-sky-600">Recent swaps</p>
        </div>
        <el-table 
          :default-sort="{ prop: 'date', order: 'descending' }" 
          v-if="store.receipts.length > 0" 
          :data="filteredReceipts" 
          height="90%"
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

      <div class="shadow-md shadow-slate-100 drop-shadow-sm bg-white border-t p-[1rem] rounded-xl h-[25rem]">
        <div class="flex gap-x-[0.5rem] mb-[1rem]">
          <Icon class="text-2xl text-green-500" name="ic:twotone-loyalty" />
          <p class="font-semibold text-green-500">Patrons <span class="text-xs">(Over ₦500,000)</span></p>
        </div>
        <el-table 
          :default-sort="{ prop: 'date', order: 'descending' }" 
          v-if="store.receipts.length > 0" 
          :data="filteredPatrons" 
          height="90%"
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

const store = useStore()

const filteredReceipts = computed(() => {
  return store.receipts.filter(receipt => receipt.swap === "Yes").slice(0, 6)
})

const filteredPatrons = computed(() => {
  const targetPrice = 500000
  const filtered = store.receipts.filter(r => r.productPrice > targetPrice)
  const sorted = filtered.sort((a, b) => a.newPrice - b.newPrice)
  return sorted
})

onMounted(() =>{
  store.fetchReceipts()
})
</script>

<style scoped>
::v-deep(.el-table__header th) {
  color: #4b5563;
  font-weight: semibold;
  font-size: 1em
}

::v-deep(.el-table__header-wrapper) {
  border-bottom: 1px solid #d1d5db;
}

::v-deep(.el-table__row) {
  font-size: 1em;
}

@media screen and (max-width: 768px) {
  ::v-deep(.el-table__row) {
    font-size: 0.8em;
    font-weight: 300;
  }
}

.el-table tr {
  @apply text-[0.75em] md:text-[0.9em]
}

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