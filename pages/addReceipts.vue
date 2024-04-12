<template>
  <div>
    <ReceiptsAddReceipt />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/users'
import { useInventoryStore } from '~/store/inventory';

definePageMeta({
  layout:'dashboard'
})

const authStore = useAuthStore()
const invStore = useInventoryStore()

onMounted(() => {
  authStore.authenticated()
  invStore.fetchInventories()
})
</script>