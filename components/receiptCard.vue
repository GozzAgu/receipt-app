<template>
  <el-input
    v-model="search"
    placeholder="Search for a receipt"
    :prefix-icon="Search"
  />

  <div class="grid grid-cols-2 gap-x-[1em] gap-y-[1.5em] mt-[2em]">
    <div v-for="card in searchR">
      <div class="bg-slate-50 shadow-lg rounded-lg text-xs p-[1em]">
        <div class="text-gray-400">
          <p class="text-base font-medium border-b border-slate-400 pb-[0.5em] mb-[0.5em] text-blue-400">
            {{ card.customerName }}
          </p>
          <p class="my-[0.5em] text-sm">{{ card.productName }}</p>
          <p class="my-[0.5em]">QTY: {{ card.productQuantity }}</p>
          <p class="my-[0.5em]">PRICE: N{{ card.productPrice }}</p>
        </div>

        <div class="mt-[1em]">
          <el-button @click="viewR(card.id)" type="primary" plain>View Receipt</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../store"
import { Search } from '@element-plus/icons-vue'

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