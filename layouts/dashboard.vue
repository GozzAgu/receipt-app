<template>
  <div>
    <Navbar @signing-out="isSigningout=true" class="z-10" />

    <div class="flex">
      <Sidenav class="hidden lg:block w-[15%]" />

      <div class="w-full lg:w-[85%]">
        <slot />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const isSigningout = ref(false)

</script>