<template>
  <div class="shadow-md shadow-slate-100 drop-shadow-sm fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em] md:px-[5em] lg:px-[15em]">
      <NuxtLink class="flex gap-x-[0.5em]" to="/dashboard">
        <img class="w-[2em]" src="/snapbill-logo.png" />
        <p class="font-bold text-lg text-sky-600">snapB!LL</p>
      </NuxtLink>

      <div class="flex gap-x-[0.7em]">
        <NuxtLink class="" to="">
          <Icon name="ri:notification-2-fill" color="gray" size="20" />
        </NuxtLink>
        <NuxtLink class="" to="/receiptTable"> 
          <el-button plain type="primary">
            <Icon name="material-symbols:receipt-long-outline" color="" size="20" />
          </el-button>
        </NuxtLink>

        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-button type="primary">
              <Icon name="ooui:user-avatar" color="" size="20" />
            </el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <Icon class="mr-[0.5em]" name="ooui:user-avatar" color="" size="15" /> 
                Profile
              </el-dropdown-item>
              <el-dropdown-item>
                <NuxtLink to="/settings">
                  <Icon class="mr-[0.5em]" name="material-symbols:settings-photo-camera" color="" size="15" /> 
                  Settings
                </NuxtLink>
              </el-dropdown-item>
              <el-dropdown-item @click="logout">
                <Icon class="mr-[0.5em] text-red-400" name="fa6-solid:power-off" size="15" /> 
                <span class="text-red-400">Logout</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { signOut } from '@firebase/auth';

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