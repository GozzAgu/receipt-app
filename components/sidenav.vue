<template>
  <div class="border-r h-[100vh] pt-[7rem] px-[1rem]">
    <div class="flex items-center gap-x-[0.3rem] p-[0.5rem] mb-[2rem]">
      <img class="w-[2rem] h-[2rem] rounded-md" :src="imageUrl" />
      <span class="font-semibold text-sky-600" v-if="authStore.currentUser?.accountType === 'admin'">
        {{ authStore.currentUser?.adminName }}
      </span>
      <span class="font-semibold text-sky-600" v-else>
        {{ authStore.managerAdmin?.adminName }}
      </span>
    </div>
    <hr>
    <div class="mt-[1rem]">
      <div v-for="route in routes" :key="route.name">
        <div :class="{ 'active-tab': $route.path === route.link }" 
          v-if="(isAdmin || isMidAdmin) || route.name !== 'Staff' && route.name !== 'Inventory'" 
          class="my-[0.5rem] p-[0.7rem] rounded-r-xl cursor-pointer hover:bg-sky-50 transition duration-300"
        >
          <NuxtLink class="flex gap-x-[0.5rem]" :to="route.link">
            <Icon class="mt-[0.3rem] " :name="route.icon" />
            <p class="">{{ route.name }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/users'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'

const authStore = useAuthStore()
let imageUrl = ref()
const nuxtApp = useNuxtApp()

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

const isMidAdmin = computed(() => {
  return authStore.currentUser?.accountType === 'midAdmin'
})

const fetchImage = async () => {
  try {
    if (authStore.currentUser) {
      if(authStore.currentUser?.accountType === 'admin') {
        const userId = authStore.currentUser?.id
        const storageReference = storageRef(nuxtApp.$storage, `images/${userId}`)
        const url = await getDownloadURL(storageReference)
        imageUrl.value = url
        console.log(userId)
      } else if(authStore.currentUser?.accountType === 'manager') {
        const userId = authStore.managerAdmin?.id
        const storageReference = storageRef(nuxtApp.$storage, `images/${userId}`)
        const url = await getDownloadURL(storageReference)
        imageUrl.value = url
      }
    } else {
      console.error("Current user not available.")
    }
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}

onMounted(async () => {
  if (authStore.currentUser?.accountType === 'manager' || authStore.currentUser?.accountType === 'midAdmin') {
    await authStore.fetchManagerAdmin()
  }
  await fetchImage()
})

</script>

<style scoped>
.active-tab {
  @apply bg-sky-600 text-white shadow-lg
}
</style>