<template>
  <div class="py-[5.5em] px-[1em] md:px-[5em] lg:px-[5em]">
    <div class="grid grid-cols-2">
      <h1 class="font-semibold text-xl text-gray-500">
        <Icon name="fa6-solid:users" color="gray" size="25" />
        <span class="text-sm md:text-base"> Staff ({{ authStore.managers.length }}) </span>
      </h1>

      <div class="flex">
        <el-input
          v-model="search"
          placeholder="Search for a staff"
          :prefix-icon="Search"
        />
      </div>
    </div>

    <hr class="mt-[1em]">
    
    <div v-loading="loading" class="mt-[1em] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[1em]">
      <div v-if="authStore.managers.length > 0" v-for="manager in paginatedManagers">
        <div class=
          "hover:scale-105 
          transition-transform 
          duration-300 
          cursor-pointer 
          font-mono 
          bg-gradient-to-t 
          from-sky-100 
          to-slate-100 
          shadow-lg 
          spiral-gradient
          rounded-xl 
          p-[1em]"
        >
          <div class="flex justify-between">
            <!-- <Icon name="jam:padlock-open-f" size="20" color="gray" /> -->
            <Icon name="jam:padlock-f" size="15" color="gray" />
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <Icon name="mdi:dots-horizontal" size="20" color="gray" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <NuxtLink>
                      <Icon name="material-symbols:accessibility" color="" size="15" /> 
                      <span class="text-xs ml-[1em]">Permission</span>
                    </NuxtLink> 
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <NuxtLink to="">
                      <Icon name="ic:baseline-block" color="" size="15" /> 
                      <span class="text-xs ml-[1em]">Deactivate staff</span>
                    </NuxtLink> 
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <NuxtLink to="">
                      <Icon name="ic:twotone-delete" color="red" size="15" />
                      <span class="text-xs ml-[1em]">Delete Staff account</span>
                    </NuxtLink> 
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class=
            "my-[1em] 
            border 
            rounded-full 
            text-white 
            bg-sky-600 
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

    <div class="fixed bottom-3 mt-[1em] right-[1em] md:right-[5em] lg:right-[15em] bg-white">
      <vue-awesome-paginate
        v-model="currentPage"
        :total-items="authStore.managers.length"
        :items-per-page="10"
        :max-pages-shown="5"
      />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/users'
import { Search } from '@element-plus/icons-vue'
import { doc, setDoc } from "firebase/firestore"; 

const loading = ref(true)
const search = ref('')
const authStore = useAuthStore()
const currentPage = ref(1)
const nuxtApp = useNuxtApp()

// const grantPermission = async (manager) => {
//   manager.accountType = 'admin'
//   const userDocRef = doc(nuxtApp.$firestore, 'users', manager.id)
//   await setDoc(userDocRef, { ...manager, accountType: manager.accountType  }, { merge: true })
// }

const searchR = computed(() => {
  return authStore.managers.filter(m => {
    return m.email.toLowerCase().includes(search.value.toLowerCase());
  })
})

const paginatedManagers = computed(() => {
  const start = (currentPage.value - 1) * 10
  const end = start + 10
  return searchR.value.slice(start, end)
})

onMounted(() => {
  authStore.loadCurrentUserFromStorage()
  authStore.fetchManagers()
  if(paginatedManagers) {
    loading.value = false
  }
})
</script>

<style scoped>
.pagination-container {
  display: flex;
  gap: 0.5em;
  margin-top: 2em;
  font-size: 0.7em;
}

::v-deep(.paginate-buttons){
  border: 1px solid #E2E8F0;
  padding: 0.5rem;
  height: 3em;
  width: 3em;
  border-radius: 0.5em;
}

::v-deep(.paginate-buttons:hover){
  @apply bg-sky-600;
  color: white;
  border: none;
  border-radius: 0.5em;
  transition: background-color 300ms;
}

::v-deep(.active-page){
  @apply bg-sky-600;
  color: white;
  height: 3.3em;
  width: 3.3em;
  border-radius: 0.5em;
}

::v-deep(.el-input__wrapper) {
  @apply py-[0.5em] rounded-xl 
}
</style>