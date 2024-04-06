<template>
  <div class="px-[1em] sm:px-[5em] lg:px-[5em] py-[5em]">
    <h1 class="font-semibold text-xl text-gray-500 my-[0.5rem]">
      <Icon name="material-symbols:settings-account-box-outline-rounded" color="gray" size="25" />
      <span class="text-sm md:text-base"> Account Management </span>
    </h1>
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane v-if="isAdmin" label="Profile" name="first">
        <EditProfile />
      </el-tab-pane>
      <el-tab-pane v-if="isAdmin" label="Managers" name="second">
        <AddManager />
      </el-tab-pane>
      <el-tab-pane label="Payment plans" name="third">Payment plans</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { useAuthStore } from '~/store/users'

const activeName = ref('first')
const authStore = useAuthStore()

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const isAdmin = computed(() => {
  return authStore.currentUser?.accountType === 'admin'
})

</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>