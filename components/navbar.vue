<template>
  <div class="shadow-md fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em]">
      <div class="flex gap-x-[0.5em]">
        <NuxtLink to="/">
          <img class="w-[2em]" src="/public/snapbill-logo.png" />
        </NuxtLink>
        <p class="font-bold text-lg text-sky-600">snapB!LL</p>
      </div>
      <NuxtLink class="font-bold text-sm mt-[0.5em] text-sky-600" to="/receipts">
        Receipts
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>

</script>