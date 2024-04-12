<template>
  <LoadersSignoutLoader v-if="isSigningout" />
  <!-- <Navbar @signing-out="isSigningout=true" class="z-10" /> -->
  <div>
    <ReceiptsReceiptTable />
  </div>
</template>

<script setup>
import { useStore } from '~/store/receipts'
import { useAuthStore } from '~/store/users'

definePageMeta({
  layout:'dashboard'
})

const store = useStore()
const authStore = useAuthStore()
const isSigningout = ref(false)

onMounted(() => {
  authStore.loadCurrentUserFromStorage()
  store.fetchReceipts()
  authStore.authenticated()
})
</script>