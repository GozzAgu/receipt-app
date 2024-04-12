<template>
  <div>
    <Users />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/users'

definePageMeta({
  layout:'dashboard'
})

const authStore = useAuthStore()

onMounted(() => {
  authStore.authenticated()
})

</script>