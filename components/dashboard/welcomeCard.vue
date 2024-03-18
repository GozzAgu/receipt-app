<template>
  <div class="pt-[5.5em] px-[1em] md:px-[5em] lg:px-[5em] relative">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div class="px-[2rem] py-[1rem] border rounded-lg shadow-md">
        <p class="font-semibold lg:w-[70%]">
          Welcome to snapB!LL, <span class="font-bold">{{ authStore.currentUser?.email }}</span> 
        </p>
        <div class="flex justify-end">
          <p class="mt-[0.5rem] text-sm border border-green-400 bg-green-100 rounded-lg w-[4rem] text-center px-[0.5rem] py-[0.1rem]">
            {{ authStore.currentUser?.accountType }}
          </p>
        </div>  
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/users'

const authStore = useAuthStore()
</script>