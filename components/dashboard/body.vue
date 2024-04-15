<template>
  <div class="px-[1em] pb-[3rem] sm:px-[5em] lg:px-[5em] mt-[2rem] relative">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-[2rem] gap-x-[3rem]">

      <div class="lg:grid grid-cols-2">
        <div class="shadow-md shadow-slate-100 drop-shadow-sm bg-white p-[1rem] rounded-xl h-[13rem]">
          <div class="flex gap-x-[0.5rem] mb-[1rem]">
            <Icon class="text-2xl text-sky-500" name="solar:list-heart-minimalistic-bold-duotone" />
            <p class="font-semibold text-sky-400">Statistic</p>
          </div>
          <div class="flex justify-center">
            <el-progress type="dashboard" :percentage="inventorySoldPercentage" :status="getStatusColor">
              <template #default="{ percentage }">
                <span v-if="inventorySoldPercentage || inventorySoldPercentage === 0" class="percentage-value text-sky-500">{{ percentage }}%</span>
                <span v-else class="percentage-label text-sky-500">Loading...</span>
                <span class="percentage-label text-sky-500">Inventories sold</span>
              </template>
            </el-progress>
          </div>
        </div>
      </div>

      <div class="shadow-md shadow-slate-100 drop-shadow-sm bg-white p-[1rem] rounded-xl h-[13rem]">
        <div class="flex gap-x-[0.5rem] mb-[1rem]">
          <Icon class="text-2xl text-orange-500" name="solar:smartphone-update-bold-duotone" />
          <p class="font-semibold text-orange-400">Receipts generated today</p>
        </div>
        <div class="overflow-y-scroll max-h-[8.5rem]">
          <el-table 
            :default-sort="{ prop: 'date', order: 'descending' }" 
            v-if="store.receipts.length > 0" 
            :data="todayReceipts" 
            style="width: 100%; max-height: 100%;"
          > 
            <el-table-column prop="customerName" label="CUSTOMER" width="100" show-overflow-tooltip />
            <el-table-column prop="productName" label="PRODUCT" width="100" show-overflow-tooltip />
            <el-table-column prop="productDescription" label="DESCRIPTION" width="100" show-overflow-tooltip />
            <el-table-column prop="newPrice" label="PRICE" width="100" show-overflow-tooltip>
              <template #default="scope">
                ₦{{ scope.row.newPrice }} 
              </template>
            </el-table-column>
            <el-table-column prop="date" sortable label="DATE" width="100"  show-overflow-tooltip />
          </el-table>
        </div>
      </div>

      <div class="shadow-md shadow-slate-100 drop-shadow-sm bg-white p-[1rem] rounded-xl h-[13rem]">
        <div class="flex gap-x-[0.5rem] mb-[1rem]">
          <Icon class="text-2xl text-sky-600" name="ic:sharp-swap-horiz" />
          <p class="font-semibold text-sky-600">Most recent swaps</p>
        </div>

        <div class="overflow-y-scroll max-h-[8.5rem]">
          <el-table 
            :default-sort="{ prop: 'date', order: 'descending' }" 
            v-if="store.receipts.length > 0" 
            :data="filteredReceipts" 
            style="width: 100%; max-height: 100%;"
          > 
            <el-table-column prop="customerName" label="CUSTOMER" width="100" show-overflow-tooltip />
            <el-table-column prop="productName" label="PRODUCT" width="100" show-overflow-tooltip />
            <el-table-column prop="swapFrom" label="SWAP FROM" width="100" show-overflow-tooltip />
            <el-table-column prop="newPrice" label="PRICE" width="100" show-overflow-tooltip>
              <template #default="scope">
                ₦{{ scope.row.newPrice }} 
              </template>
            </el-table-column>
            <el-table-column prop="date" sortable label="DATE" width="100"  show-overflow-tooltip />
          </el-table>
        </div>
      </div>

      <div class="shadow-md shadow-slate-100 drop-shadow-sm bg-white p-[1rem] rounded-xl h-[13rem]">
        <div class="flex gap-x-[0.5rem] mb-[1rem]">
          <Icon class="text-2xl text-green-500" name="ic:twotone-loyalty" />
          <p class="font-semibold text-green-500">Patrons <span class="text-xs">(Over ₦500,000)</span></p>
        </div>

        <div class="overflow-y-scroll max-h-[8.5rem]">
          <el-table 
            :default-sort="{ prop: 'date', order: 'descending' }" 
            v-if="store.receipts.length > 0" 
            :data="filteredPatrons" 
            style="width: 100%; max-height: 100%;"
          > 
            <el-table-column prop="customerName" label="CUSTOMER" width="100" show-overflow-tooltip />
            <el-table-column prop="productName" label="PRODUCT" width="100" show-overflow-tooltip />
            <el-table-column prop="productDescription" label="DESCRIPTION" width="100" show-overflow-tooltip />
            <el-table-column prop="newPrice" label="PRICE" width="100" show-overflow-tooltip>
              <template #default="scope">
                ₦{{ scope.row.newPrice }} 
              </template>
            </el-table-column>
            <el-table-column prop="date" sortable label="DATE" width="100"  show-overflow-tooltip />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { useInventoryStore } from "@/store/inventory"

const store = useStore()
const invStore = useInventoryStore()
const today = ref(new Date())

const todayReceipts = computed(() => {
  const todayDate = today.value.toISOString().split('T')[0]
  return store.receipts.filter(receipt => {
    const receiptDate = new Date(receipt.date).toISOString().split('T')[0]
    return receiptDate === todayDate
  }).slice(0, 6)
})

const filteredReceipts = computed(() => {
  return store.receipts.filter(receipt => receipt.swap === "Yes").slice(0, 6)
})

const filteredPatrons = computed(() => {
  const targetPrice = 500000
  const filtered = store.receipts.filter(r => r.productPrice > targetPrice)
  const sorted = filtered.sort((a, b) => a.newPrice - b.newPrice)
  return sorted
})

const inventorySoldPercentage = computed(() => {
  return Math.ceil((store.receipts.length / invStore.inventories.length) * 100)
})

const getStatusColor = (percentage: number) => {
  if (percentage >= 100) {
    return 'success';
  } else if (percentage >= 50) {
    return 'warning';
  } else {
    return 'exception';
  }
}

onMounted(() =>{
  store.fetchReceipts()
})
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
.demo-progress .el-progress--circle {
  margin-right: 15px;
}

::v-deep(.cell) {
  @apply text-[0.8em]
}

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