<template>
  <div 
    v-loading="isSigningout" 
    element-loading-text="Signing out..."
    element-loading-background="rgba(122, 122, 122, 0.5)"
  >
    <Navbar  @signing-out="isSigningout=true" class="z-10" />

    <div class="flex">
      <Sidenav class="hidden lg:block w-[15%]" />

      <div class="w-full lg:w-[85%] mt-[2em] bg-gray-50">
        <slot />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const isSigningout = ref(false)

</script>