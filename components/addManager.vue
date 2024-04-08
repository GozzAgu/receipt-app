<template>
  <div class="">    
    <div v-loading="loading" class=" bg-white py-[0.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-sky-600">Create  Managers</span></el-divider>
      
      <el-form
        ref="ruleFormRef"
        :model="manager"
        status-icon
        :rules="passwordRules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">

          <el-form-item label="Email" prop="email">
            <el-input v-model="manager.email" placeholder="" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="manager.password" placeholder="" />
          </el-form-item>
        </div>
        <el-button @click="addM(ruleFormRef)"> 
          <Icon class="text-white ml-[0.5rem]" name="tabler:user-plus" size="15" />
          <span class="ml-[0.2em] text-white">Create</span>
        </el-button> 
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type FormProps, type FormInstance, type FormRules} from 'element-plus'
import type { Manager } from '@/types/types'
import { setDoc, doc } from "firebase/firestore"
import { AccountType } from "@/types/types";
import { useAuthStore } from '~/store/users';
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword, type Auth } from '@firebase/auth';

const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const nuxtApp = useNuxtApp()
const store = useAuthStore()

let manager = reactive<Manager>({
  id: '',
  adminId: '',
  email: '',
  password: '',
  accountType: AccountType.Manager,
})

const passwordRules = reactive<FormRules<Manager>>({
  email: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
})

const success = () => {
  ElMessage({
    message: 'Manager created successfully',
    type: 'success',
  })
}

const setUserAccountType = async (adminId: string, manager: Manager) => {
  const userDocRef = doc(nuxtApp.$firestore, 'users', adminId)
  await setDoc(userDocRef, 
    { ...manager },
    { merge: true }
  )
}

const addM = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        manager.adminId = nuxtApp.$auth.currentUser?.uid
        const response = await createUserWithEmailAndPassword(nuxtApp.$auth, manager.email, manager.password)
        await setUserAccountType(response.user.uid, manager)
        if(response)  {
          await signOut(nuxtApp.$auth);
          await signInWithEmailAndPassword(nuxtApp.$auth, store.currentUser!.email!, store.currentUser!.password)
        }
      } catch (e) {
        console.log(e)
      }
      finally {
        loading.value = false
        manager.email = '',  
        manager.password = ''
      }
      success()
    } else {
      console.log('error submit!', fields);
    }
  });
};


onMounted(() => {
  const store = useAuthStore()
  store.loadCurrentUserFromStorage()
})

</script>

<style scoped>
::v-deep(.el-input__wrapper) {
  @apply py-[0.5em] rounded-xl 
}

::v-deep(.el-button) {
  @apply bg-sky-600 text-white py-[1.5em] rounded-xl w-full md:w-1/3 mt-[1.5rem]
}

::v-deep(.el-button):hover {
  @apply bg-sky-500 text-white py-[1.5em] rounded-xl 
}
</style>