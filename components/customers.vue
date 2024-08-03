<template>
  <div class="px-[1em] pb-[3rem] sm:px-[5em] lg:px-[5em] mt-[2rem] relative mt-[5rem]">
    <h1 class="text-xl text-gray-500">
      <Icon name="material-symbols:receipt-long-outline" color="gray" size="25" />
      <span class="text-base md:text-lg font-semibold"> Customers</span>
    </h1>
    <div class="shadow-md shadow-slate-100 drop-shadow-sm bg-white p-[1rem] rounded-xl min-h-[30rem] mt-[2rem]">
      <el-collapse>
        <el-collapse-item v-for="group in groupedReceiptsByPhone" :key="group[0].customerNumber" :title="group[0].customerName + ' (Phone: ' + group[0].customerNumber + ')'">
          <el-table :data="group" style="width: 100%; max-height: 100%;"> 
            <el-table-column prop="productName" label="PRODUCT" width="150" show-overflow-tooltip />
            <el-table-column prop="productDescription" label="DESCRIPTION" width="150" show-overflow-tooltip />
            <el-table-column prop="newPrice" label="PRICE" width="100" show-overflow-tooltip>
              <template #default="scope">
                ₦{{ scope.row.newPrice }} 
              </template>
            </el-table-column>
            <el-table-column prop="customerAddress" label="ADDRESS" width="150" show-overflow-tooltip />
            <el-table-column prop="paidVia" width="90" label="PAID VIA" show-overflow-tooltip>
              <template #default="{ row }">
                <div
                  :class="
                    { 'text-green-500 text-center text-xs': row.paidVia === 'Cash',
                      'text-pink-500 text-center text-xs': row.paidVia === 'Pos',
                      'text-sky-500 text-center text-xs': row.paidVia === 'Transfer'
                    }"
                >
                  {{ row.paidVia }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="date" sortable label="DATE" width="100" show-overflow-tooltip />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>



<script setup lang="ts">
import { useStore } from "@/store/receipts"

const store = useStore()

// const filteredPatrons = computed(() => {
//   const targetPrice = 500000
//   const filtered = store.receipts.filter(r => r.productPrice > targetPrice)
//   const sorted = filtered.sort((a, b) => a.newPrice - b.newPrice)
//   return sorted
// })

const groupedReceiptsByPhone = computed(() => {
  const grouped = store.receipts.reduce((acc, receipt) => {
    const phoneNumber = receipt.customerNumber;
    if (phoneNumber) {
      if (!acc[phoneNumber]) {
        acc[phoneNumber] = [];
      }
      acc[phoneNumber].push(receipt);
    }
    return acc;
  }, {} as Record<string, typeof store.receipts>);

  return Object.values(grouped);
});

onMounted(() =>{
  store.fetchReceipts()
})
</script>

<style scoped>
::v-deep(.cell) {
  @apply text-[0.8em]
}

::v-deep(.el-table__header-wrapper) {
  border-bottom: 1px solid #d1d5db;
}

@media screen and (max-width: 768px) {
  ::v-deep(.el-table__row) {
    /* font-size: 0.8em; */
    font-weight: 300;
  }
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