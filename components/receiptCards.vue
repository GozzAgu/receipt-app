<template>
  <div class="py-[6em] px-[1em] ">
    <ReceiptCard v-if="store.receipts.length > 0"/>

    <el-empty v-else>
      <NuxtLink to="/addReceipts">
        <el-button type="primary">Generate Receipt</el-button>
      </NuxtLink>
    </el-empty>
  </div>
</template>

<script setup>
import { useStore } from "../store"

const store = useStore()

onMounted(() => {
  store.fetchReceipts()
})
</script>