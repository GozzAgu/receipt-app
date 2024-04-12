<template>
  <div>
    <Users />
  </div>
</template>

<script setup>
definePageMeta({
  layout:'dashboard'
})

onMounted(() => {
  authStore.authenticated()
})

</script>