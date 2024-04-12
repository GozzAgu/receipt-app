<template>
  <div>
    <ReceiptsAddReceipt />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/users'

definePageMeta({
  layout:'dashboard'
})

const authStore = useAuthStore()

onMounted(() => {
  authStore.authenticated()
})
</script>