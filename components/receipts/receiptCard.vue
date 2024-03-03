<template>
  <div class="px-[1em] md:px-[5em] lg:px-[15em]">
    <el-input
      v-model="search"
      placeholder="Search for a receipt"
      :prefix-icon="Search"
    />
  
    <div v-loading="loading" class=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-[1em] gap-y-[1.5em] mt-[2em]">
      <div v-for="card in searchR">
        <div class="bg-gradient-to-l from-blue-50 to-slate-50 border shadow-lg rounded-lg text-xs p-[1em]">
          <div class="text-gray-400">
            <div class="pb-[0.5em] flex justify-between text-base font-medium border-b border-slate-300 text-gray-500">
              <p class="text-[1em]">
                {{ card.customerName }}
              </p>
              <div class="flex gap-x-[0.8em]">
                <div class="mt-[0.3em] text-green-500">
                  <el-icon @click="dupR(card.id)"><CopyDocument/></el-icon>
                </div>
                <div class="mt-[0.3em] text-red-500">
                  <el-icon @click="delR(card.id)"><Remove /></el-icon>
                </div>
              </div>
            </div>
            
            <p class="my-[0.5em] text-[1em]">{{ card.productName }}</p>
            <p class="my-[0.5em] text-[0.8em]">QTY: {{ card.productQuantity }}</p>
            <p class="my-[0.5em] text-[0.8em]">PRICE/UNIT: ₦{{ card.productPrice }}</p>
            <p class="my-[0.5em] text-[0.8em]">TOTAL: ₦{{ card.newPrice }}</p>
          </div>
  
          <div class="mt-[1em]">
            <el-button class="w-[100%]" @click="viewR(card.id)" type="primary" plain>
              <el-icon><Tickets /></el-icon>
              <span class="ml-[1em] text-[0.7em]">View Receipt</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { Search, Tickets, Remove, CopyDocument } from '@element-plus/icons-vue'

const search = ref('')
const router = useRouter()
const store = useStore()
const loading = ref(true)

const isShown = () => {
  if(store.receipts) {
    loading.value = false
  }
}

const searchR = computed(() => {
  return store.receipts.filter(r => {
    return r.productName.toLowerCase().includes(search.value.toLowerCase());
  });
})

const viewR = (index:string) => {
  router.push({path:`/receipt/${index}`})
}

const delR = (id:string) => {
  store.deleteReceipt(id)
  store.fetchReceipts()
}

const dupR = (id:string) => {
  router.push({path:`/dupReceipt/${id}`})
}

onMounted(() => {
  isShown()
  store.fetchReceipts()
})
</script>