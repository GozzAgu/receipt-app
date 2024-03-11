<template>
  <div class="py-[5.5em] px-[1em] md:px-[5em] lg:px-[15em]">
    <div class="grid grid-cols-2">
      <h1 class="font-semibold text-xl text-gray-500">
        <Icon name="fa6-solid:users" color="gray" size="25" />
        <span class=""> Staff ({{ authStore.managers.length }}) </span>
      </h1>
      <el-input
        v-model="search"
        placeholder="Search for a staff"
        :prefix-icon="Search"
      />
    </div>
    <hr class="mt-[1em]">
    <div class="mt-[1em] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[1em]">
      <div v-for="manager in authStore.managers">
        <div class=
          "hover:scale-105 
          transition-transform 
          duration-300 
          cursor-pointer 
          font-mono 
          bg-gradient-to-t 
          from-blue-100 
          to-slate-100 
          shadow-lg 
          rounded-xl 
          p-[1em]"
        >
          <div class="flex justify-between">
            <!-- <Icon name="jam:padlock-open-f" size="20" color="gray" /> -->
            <Icon name="jam:padlock-f" size="20" color="gray" />
            <Icon name="mdi:dots-horizontal" size="20" color="gray" />
          </div>

          <div class=
            "my-[1em] 
            border 
            rounded-full 
            text-white 
            bg-blue-400 
            text-xl 
            font-bold 
            w-12 
            h-12 
            flex 
            items-center 
            m-auto 
            justify-center"
          >
            {{ manager.email.charAt(0).toUpperCase() }}
          </div>
          <p class="text-xs text-center">{{ manager.email }}</p>
          <p class="text-xs text-center">{{ manager.accountType }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '~/store/receipts'
import { useAuthStore } from '~/store/users'
import { Search } from '@element-plus/icons-vue'

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