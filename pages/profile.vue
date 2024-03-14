<template>
  <!-- <SignoutLoader v-if="isSigningout" /> -->
  <div>
    <Profile />
  </div>
</template>

<script setup>
import { useStore } from "../store/receipts"

definePageMeta({
  layout:'dashboard'
})

</script>