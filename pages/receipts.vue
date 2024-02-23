<template>
  <Navbar class="z-10" />
  <div class="mt-[5em]">
    <el-empty>
      <el-button type="primary">Button</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { useStore } from "../store"

const store = useStore()
onMounted(() => {
  store.fetchReceipts()
})
</script>