<template>
  <SignoutLoader v-if="isSigningout" />
  <Navbar @signing-out="isSigningout=true" class="z-10" />
  <div>
    <Settings />
  </div>
</template>

<script setup>
import { useStore } from "../store/receipts"
import { useAuthStore } from "~/store/users";

const store = useStore()
const authStore = useAuthStore()
const isSigningout = ref(false)

onMounted(() => {
  store.fetchReceipts();
  authStore.authenticated()
})
</script>