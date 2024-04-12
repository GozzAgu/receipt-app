<template>
  <div class="border-r h-[100vh] pt-[7rem] px-[1rem]">
    <div v-for="route in routes" :key="route.name">
      <div :class="{ 'active-tab': $route.path === route.link }" 
        v-if="isAdmin || route.name !== 'Staff' && route.name !== 'Inventory'" 
        class="my-[0.5rem] p-[0.7rem] rounded-xl cursor-pointer hover:bg-sky-50 transition duration-300"
      >
        <NuxtLink class="flex gap-x-[0.5rem]" :to="route.link">
          <Icon class="mt-[0.3rem] " :name="route.icon" />
          <p class="">{{ route.name }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/users'

const authStore = useAuthStore()

const routes = ref([
  {
    name: 'Dashboard',
    icon: 'tdesign:dashboard-1',
    link: '/dashboard'
  },
  {
    name: 'Receipts',
    icon: 'material-symbols:receipt-long-outline',
    link: '/receiptTable'
  },
  {
    name: 'Inventory',
    icon: 'material-symbols:inventory-rounded',
    link: '/inventory'
  },
  // {
  //   name: 'Returns',
  //   icon: 'heroicons:receipt-refund',
  //   link: '/returns'
  // },
  {
    name: 'Staff',
    icon: 'ph:users-three-bold',
    link: '/users'
  },
  {
    name: 'Account',
    icon: 'material-symbols:settings-account-box-outline-rounded',
    link: '/profile'
  },
])

const isAdmin = computed(() => {
  return authStore.currentUser?.accountType === 'admin'
})

</script>

<style scoped>
.active-tab {
  @apply bg-sky-600 text-white
}
</style>