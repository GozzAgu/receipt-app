<template>
  <div class="pt-[5.5em] px-[1em] md:px-[5em] lg:px-[5em] relative">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[3rem]">
      <div class="px-[2rem] py-[1rem] border rounded-lg shadow-md">
        <p class="font-semibold lg:w-[70%]">
          Welcome to snapB!LL, <span class="font-bold">{{ authStore.currentUser?.email }}</span> 
        </p>
        <div class="flex justify-end">
          <p class="mt-[0.5rem] text-sm text-green-500 border border-green-400 bg-green-100 rounded-lg w-[4rem] text-center px-[0.5rem] py-[0.1rem]">
            {{ authStore.currentUser?.accountType }}
          </p>
        </div>  
      </div>
      <!-- <div class="grid grid-cols-2">
        <el-statistic title="Total Receipts" :value="outputValue" />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/users'
import { useStore } from '~/store/receipts'

const route = useRoute()
const authStore = useAuthStore()
const store = useStore()
const receipts = ref(0)

watch(() => store.receipts.length, (newLength) => {
  receipts.value = newLength
})

watch(() => store.receipts.length, (newLength) => {
  receipts.value = newLength
})

const outputValue = useTransition(receipts, {
  duration: 1500,
})
</script>