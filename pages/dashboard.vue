<template>
  <div>
    <DashboardWelcomeCard />
    <DashboardBody />
  </div>
</template>

<script setup lang="ts">
import auth from '~/components/middleware/auth';
import { useAuthStore } from '~/store/users'

definePageMeta({
  layout:'dashboard',
})

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.authenticated()
})
</script>