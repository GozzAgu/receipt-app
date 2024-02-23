<template>
  <div class="py-[5em] px-[1em] ">
    <el-input
      v-model="search"
      placeholder="Search for a receipt"
      :prefix-icon="Search"
    />

    <ReceiptCard v-if="store.receipts.length > 0"/>

    <el-empty v-else>
      <el-button type="primary">Generate Receipt</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { useStore } from "../store"
import { Search } from '@element-plus/icons-vue'

const search = ref('')
const store = useStore()
onMounted(() => {
  store.fetchReceipts()
})
</script>