<template>
   <div class="px-[1em] sm:px-[5em] lg:px-[10em] py-[5em]">
      <LoadersWaitingLoader />
      
      <NuxtLink 
         class="
         p-[0.5rem]
         my-[1rem]
         bg-sky-600 
         hover:bg-sky-500 
         transition 
         duration-500 
         hover:shadow-lg 
         rounded-lg 
         flex 
         justify-center 
         items-center 
         w-[2.5rem]" 
         to="/dashboard"
      > 
         <Icon class="text-white" name="solar:arrow-left-line-duotone" size="20" />
      </NuxtLink> 

      <div v-for="receipt in store.receipts" class="py-[0.3em] rounded-lg grid grid-cols-1">
         <div class=
            "hover:scale-105 
            transition-transform 
            duration-300 
            cursor-pointer 
            font-mono 
            bg-gradient-to-t 
            from-sky-100 
            to-slate-100 
            shadow-sm 
            spiral-gradient
            rounded-xl 
            text-gray-500
            text-sm
            p-[1em]"
         >
            A receipt for {{ receipt.productName }} was generated
         </div>
      </div>  
   </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"

const store = useStore()

onMounted(() =>{
  store.fetchReceipts()
})
</script>

<style scoped>

</style>