<template>
  <div class="px-[1em] md:px-[5em] lg:px-[15em] py-[5em]">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="Profile" name="first">Profile</el-tab-pane>
      <el-tab-pane label="Password & security" name="second">
        <Settings />
      </el-tab-pane>
      <el-tab-pane label="Payment plans" name="third">Payment plans</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>