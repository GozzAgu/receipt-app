<template>
  <div class="shadow-md shadow-slate-100 drop-shadow-sm fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em] sm:px-[5em] lg:px-[5em]">
      <NuxtLink class="flex gap-x-[0.5em]" to="/dashboard">
        <img class="shrink-0 w-[2rem] h-[2rem]" src="/snapbill-logo.png" />
        <p class="shrink-0 font-bold text-base md:text-lg text-sky-600 mt-[0.15rem]">snapB!LL</p>
      </NuxtLink>

      <div class="flex gap-x-[0.4rem] z-10">
        <NuxtLink class="" to="/notifications">
          <Icon class="text-orange-300 mt-[0.3rem]" name="solar:bell-bing-bold-duotone" size="27" />
        </NuxtLink>

        <div class="lg:hidden" @click="showDrawer">
          <NuxtLink 
            class="
              bg-sky-100 
              p-[0.2rem]
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
            <Icon class="text-sky-600" name="majesticons:dashboard" color="" size="30" />
          </NuxtLink> 
        </div>

        <div v-show="drawer" class="fixed inset-0 h-screen bg-sky-950 opacity-20 z-10" @click="drawer = false"></div>

        <Transition name="slide-fade">
          <div v-show="drawer" 
            class="
              lg:hidden rounded-l-[1rem] p-[1rem] absolute
              h-[100vh] right-0 top-0 bg-white shadow-lg z-20 w-[80%]"
          >
            <div class="">
              <div @click="showDrawer" class="cursor-pointer p-[1.5rem]">
                <Icon class="text-sky-600" name="material-symbols:close" color="" size="25" />
              </div>
            </div>
            <div class="flex items-center gap-x-[0.3rem] px-[1.5rem] mb-[2rem]">
              <img class="w-[2rem] h-[2rem] rounded-md" :src="imageUrl" />
              <span class="font-semibold text-sky-600" v-if="authStore.currentUser?.accountType === 'admin'">
                {{ authStore.currentUser?.adminName }}
              </span>
              <span class="font-semibold text-sky-600" v-else>
                {{ authStore.managerAdmin?.adminName }}
              </span>
            </div>
            <hr>
            <div class="px-[1.5rem] mt-[2rem]">
              <div v-for="route in routes" :key="route.name">
                <div :class="{ 'active-tab': $route.path === route.link }" 
                  v-if="isAdmin || route.name !== 'Staff' && route.name !== 'Inventory'"
                  class="
                    flex my-[0.5rem] p-[0.7rem] rounded-xl cursor-pointer 
                    hover:bg-blue-50 transition duration-300"
                >
                  <NuxtLink class="flex gap-x-[0.5rem]" :to="route.link">
                    <Icon class="mt-[0.3rem] text-sky-600" :name="route.icon" />
                    <p class="text-sky-600 font-semibold">{{ route.name }}</p>
                  </NuxtLink>
                </div>
              </div>
              <hr>
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
            <span class="el-dropdown-link bg-sky-100 p-[0.1rem] rounded-lg"> 
              <Icon class="text-sky-600" name="material-symbols-light:person" color="" size="35" />
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
import { ref as storageRef, getDownloadURL } from 'firebase/storage'

let imageUrl = ref()
const route = useRoute()
const router = useRouter()
const emit = defineEmits(['signing-out'])
const nuxtApp = useNuxtApp()
const authStore = useAuthStore()
const drawer = ref(false)
const loading = false

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
    link: '/inventory'
  },
  {
    name: 'Customers',
    icon: 'ph:users-four-bold',
    link: '/customers'
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

onMounted(() => {
  fetchImage()
})

const fetchImage = async () => {
  try {
    if (authStore.currentUser) {
      if(authStore.currentUser?.accountType === 'admin') {
        const userId = authStore.currentUser?.id
        const storageReference = storageRef(nuxtApp.$storage, `images/${userId}`)
        const url = await getDownloadURL(storageReference)
        imageUrl.value = url
        console.log(userId)
      } else if(authStore.currentUser?.accountType === 'manager' || authStore.currentUser?.accountType === 'midAdmin') {
        const userId = authStore.currentUser?.adminId
        const storageReference = storageRef(nuxtApp.$storage, `images/${userId}`)
        const url = await getDownloadURL(storageReference)
        imageUrl.value = url
      }      
    } else {
      console.error("Current user not available.")
    }
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}

const logout = () => {
  setTimeout(function(){
    signOut(nuxtApp.$auth)
    authStore.currentUser = null
    localStorage.removeItem('currentUser')
    router.push('/auth/signin')
  }, 3000);
  emit('signing-out')
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: transform 0.3s ease-in;
}
.slide-fade-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(100%);
}
</style>