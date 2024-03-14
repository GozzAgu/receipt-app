<template>
  <div class="shadow-md shadow-slate-100 drop-shadow-sm fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em] md:px-[5em] lg:px-[5em]">
      <NuxtLink class="flex gap-x-[0.5em]" to="/receiptTable">
        <img class="w-[2em]" src="/snapbill-logo.png" />
        <p class="font-bold text-base md:text-lg text-sky-600 mt-[0.15rem]">snapB!LL</p>
      </NuxtLink>

      <div class="flex gap-x-[0.7em]">
        <NuxtLink class="" to="">
          <Icon class="text-orange-200 mt-[0.3rem]" name="ri:notification-2-fill" size="25" />
        </NuxtLink>

        <div class="lg:hidden" @click="showDrawer">
          <NuxtLink 
            class="
              p-[0.25rem]
             
              transition 
              duration-500 
              hover:shadow-lg 
              rounded-lg 
              flex 
              justify-center 
              items-center 
              w-[100%]" 
              @click="addR(ruleFormRef)"
          > 
            <Icon class="text-sky-600" name="material-symbols:dashboard" color="" size="27" />
          </NuxtLink> 
        </div>

        <Transition name="slide-fade">
          <div v-show="drawer" class="lg:hidden rounded-l-[3rem] p-[1rem] absolute top-0 left-[5rem] h-[100vh] w-full bg-white shadow-lg z-10">
            <div class="">
              <div @click="showDrawer" class="cursor-pointer p-[1.5rem]">
                <Icon class="text-sky-600" name="material-symbols:close" color="" size="25" />
              </div>
            </div>
            <hr>
            <div class="px-[1.5rem] mt-[2rem]">
              <div v-for="route in routes" :key="route.name">
                <div :class="{ 'active-tab': $route.path === route.link }" 
                  v-if="isAdmin || route.name !== 'Staff'" 
                  class="flex my-[0.5rem] p-[0.7rem] rounded-xl cursor-pointer hover:bg-blue-50 transition duration-300"
                >
                  <NuxtLink class="flex gap-x-[0.5rem]" :to="route.link">
                    <Icon class="mt-[0.3rem] " :name="route.icon" />
                    <p class="">{{ route.name }}</p>
                  </NuxtLink>
                </div>
              </div>
              <div class="p-[0.7rem]">
                  <el-popconfirm @confirm="logout" title="Are you sure to logout?">
                    <template #reference>
                      <div class="">
                        <Icon class="mr-[0.5em] text-red-400" name="lucide:log-out" size="16" />
                        <span class="text-red-400">Logout</span> 
                      </div>
                    </template>
                  </el-popconfirm>
                </div>
            </div>
          </div>
        </Transition>

        <div class="hidden lg:block">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link"> 
              <Icon class="text-gray-600" name="material-symbols-light:person" color="" size="30" />
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
                <el-dropdown-item>
                  <el-popconfirm @confirm="logout" title="Are you sure to logout?">
                    <template #reference>
                      <div class="">
                        <Icon class="mr-[0.5em] text-red-400" name="fa6-solid:power-off" size="16" />
                        <span class="text-red-400">Logout</span> 
                      </div>
                    </template>
                  </el-popconfirm>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { signOut } from '@firebase/auth'
import { useAuthStore } from '~/store/users'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['signing-out'])
const nuxtApp = useNuxtApp()
const authStore = useAuthStore()
const drawer = ref(false)

const isAdmin = computed(() => {
  return authStore.currentUser?.accountType === 'admin'
})

const showDrawer = () => {
  drawer.value = !drawer.value
}

watch(() => route.path, () => {
  drawer.value = false
})

const routes = ref([
  {
    name: 'Dashboard',
    icon: 'tdesign:dashboard-1',
    link: '/dashboard'
  },
  {
    name: 'Receipts',
    icon: 'material-symbols:receipt-long-outline',
    link: '/receiptTable'
  },
  {
    name: 'Inventory',
    icon: 'material-symbols:inventory-rounded',
    link: ''
  },
  {
    name: 'Staff',
    icon: 'ph:users-three-bold',
    link: '/users'
  },
  {
    name: 'Account',
    icon: 'material-symbols:settings-account-box-outline-rounded',
    link: '/profile'
  }
])

const logout = () => {
  setTimeout(function(){
    signOut(nuxtApp.$auth);
      router.push('/auth/signin');
  }, 3000);
  emit('signing-out')
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 1s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100%);
}

.slide-fade-leave-enter, .slide-fade-enter-to {
  transform: translateX(0);
}
</style>