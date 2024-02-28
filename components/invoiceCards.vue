<template>
  <div class="py-[6em] px-[1em] ">
    <p class="border p-[0.5em] shadow-lg animate-bounce my-[1em] text-center text-orange-500 font-thin">
      app in progress...
    </p>

    <div>
      <ReceiptCard v-if="store.receipts.length >0"/>
  
      <el-empty v-else>
        <NuxtLink to="/addReceipts">
          <el-button type="primary">Generate Receipt</el-button>
        </NuxtLink>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../store/invoices"

const store = useStore()

onMounted(() => {
  store.fetchReceipts()
})
</script>