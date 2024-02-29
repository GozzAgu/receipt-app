<template>
  <div class="shadow-md fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em]">
      <NuxtLink class="flex gap-x-[0.5em]" to="/dashboard">
        <img class="w-[2em]" src="/public/snapbill-logo.png" />
        <p class="font-bold text-lg text-sky-600">snapB!LL</p>
      </NuxtLink>

      <div class="flex gap-x-[0.3em]">
        <el-icon class="mt-[0.5em]"><Bell /></el-icon>
        <NuxtLink class="mx-[0.5em]" to="/addReceipts">
          <el-button plain type="primary">
            <span>Receipt</span>
          </el-button>
        </NuxtLink>
        <!-- <NuxtLink to="/addInvoice">
          <el-button plain type="primary">
            <span>Invoice</span>
          </el-button>
        </NuxtLink> -->
        <el-button @click="logout" type="primary">
          <el-icon><SwitchButton /></el-icon>
          <!-- <span>Sign Out</span> -->
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  signOut } from '@firebase/auth';
import { SwitchButton, Bell } from '@element-plus/icons-vue'

const router = useRouter()
const emit = defineEmits(['signing-out'])

const logout = () => {
  const nuxtApp = useNuxtApp()
  setTimeout(function(){
    signOut(nuxtApp.$auth);
      router.push('/auth/signin');
  }, 3000);
  emit('signing-out');
}
</script>