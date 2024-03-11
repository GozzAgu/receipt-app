<template>
  <div class="shadow-md shadow-slate-100 drop-shadow-sm fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em] md:px-[5em] lg:px-[15em]">
      <NuxtLink class="flex gap-x-[0.5em]" to="/receiptTable">
        <img class="w-[2em]" src="/snapbill-logo.png" />
        <p class="font-bold text-base md:text-lg text-sky-600">snapB!LL</p>
      </NuxtLink>

      <div class="flex gap-x-[0.7em]">
        <NuxtLink class="" to="">
          <Icon name="ri:notification-2-fill" color="orange" size="20" />
        </NuxtLink>
        <NuxtLink class="" to="/receiptTable"> 
          <el-button plain type="primary">
            <Icon name="material-symbols:receipt-long-outline" color="" size="20" />
          </el-button>
        </NuxtLink>

        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-button type="primary">
              <Icon name="solar:user-circle-bold-duotone" color="" size="25" />
            </el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <NuxtLink to="/profile">
                  <Icon class="mr-[0.5em]" name="ooui:user-avatar" color="" size="15" /> 
                  Profile
                </NuxtLink> 
              </el-dropdown-item>
              <el-dropdown-item v-if="isAdmin">
                <NuxtLink to="/users">
                  <Icon class="mr-[0.5em]" name="fa6-solid:users" color="" size="20" />
                  Users
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
import { signOut } from '@firebase/auth'
import { useAuthStore } from '~/store/users'

const router = useRouter()
const emit = defineEmits(['signing-out'])
const nuxtApp = useNuxtApp()
const authStore = useAuthStore()

const isAdmin = computed(() => {
  return authStore.currentUser?.accountType === 'admin'
})

const logout = () => {
  setTimeout(function(){
    signOut(nuxtApp.$auth);
      router.push('/auth/signin');
  }, 3000);
  emit('signing-out')
}
</script>