<template>
  <!-- <SignoutLoader v-if="isSigningout" /> -->
  <Navbar @signing-out="isSigningout=true" class="z-10" />
  <div>
    <Profile />
  </div>
</template>

<script setup>
import { useStore } from "../store/receipts"

const store = useStore()
// const isSigningout = ref(false)

</script>