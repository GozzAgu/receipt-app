<template>
  <LoadersSignoutLoader v-if="isSigningout" />
  <Navbar @signing-out="isSigningout=true" class="z-10" />
  <div>
    <ReceiptsReceiptTable />
  </div>
</template>

<script setup>
import { useStore } from "../store/receipts"

const store = useStore()
const isSigningout = ref(false)

onMounted(() => {
  store.fetchReceipts();
})
</script>