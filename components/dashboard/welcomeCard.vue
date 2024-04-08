<template>
  <div class="pt-[5.5em] px-[1em] sm:px-[5em] lg:px-[5em] relative">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-[3rem] gap-y-[1rem]">
      <div class="flex justify-center items-center px-[2rem] py-[1rem] rounded-2xl shadow-md bg-sky-600">
        <p class="text-base md:text-xl font-bold text-sky-100">
          Welcome to 
          <span v-if="authStore.currentUser?.accountType === 'admin'">
            {{ authStore.currentUser?.adminName }}
          </span>
          <span v-else>
            {{ authStore.managerAdmin?.adminName }}
          </span>
        </p>
      </div>
      
      <div class="bg-sky-600 flex justify-between gap-x-[3rem] px-[2rem] py-[1rem] rounded-2xl shadow-md">
        <el-statistic title="Total Receipts" :value="outputValue" />
        <el-statistic title="Total Inventories" :value="outputValue2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/users'
import { useStore } from '~/store/receipts'
import { useInventoryStore } from '~/store/inventory';

const authStore = useAuthStore()
const store = useStore()
const invStore = useInventoryStore()
const receipts = ref(0)
const inventories = ref(0)

watchEffect(() => {
  receipts.value = store.receipts.length
  inventories.value = invStore.inventories.length
})

const outputValue = useTransition(receipts, {
  duration: 1500,
})

const outputValue2 = useTransition(inventories, {
  duration: 1500,
})

onMounted(async () => {
  await authStore.fetchCurrentUser()
  if (authStore.currentUser?.accountType === 'manager') {
    authStore.fetchManagerAdmin()
  }
})
</script>

<style scoped>
::v-deep(.el-statistic__head) {
  @apply text-white text-sm font-semibold text-center
}

::v-deep(.el-statistic__content) {
  @apply text-white text-3xl font-bold text-center
}
</style> 