<template>
  <div class="py-[5.5em] px-[1em] md:px-[5em] lg:px-[15em]">
    <div>
      <div>
        <pre>{{ authStore.currentUser?.uid }}</pre>
        <pre>{{ authStore.managers }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '~/store/receipts'
import { useAuthStore } from '~/store/users'

const store = useStore()
const authStore = useAuthStore()

onMounted(() => {
  authStore.loadCurrentUserFromStorage()
  authStore.fetchManagers()
  console.log(authStore.currentUser)
})
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>