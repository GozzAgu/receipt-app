<template>
  <div class="">    
    <div v-loading="loading" class=" bg-white py-[0.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-blue-400">Create  Managers</span></el-divider>
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
        <el-button class="mt-[2em]" type="primary" @click="addM(ruleFormRef)">
          <Icon name="tabler:users-plus" color="white" size="15" />
          <span class="ml-[0.2em] text-[0.7em] md:text-base">Create</span>
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { Manager } from '@/types/types'
import { createUserWithEmailAndPassword, type Auth } from '@firebase/auth';
import { AccountType } from "@/types/types";
import { doc, setDoc } from "firebase/firestore"; 

const store = useStore()
const router = useRouter()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const nuxtApp = useNuxtApp()

let manager = reactive<Manager>({
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

onMounted(() => {
  store.fetchReceipts()
})

const setUserAccountType = async (userId: string, manager: Manager) => {
  const userDocRef = doc(nuxtApp.$firestore, 'users', userId)
  await setDoc(userDocRef, { manager }, { merge: true })
};

const addM = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        manager.adminId = nuxtApp.$auth.currentUser?.uid
        const response = await createUserWithEmailAndPassword(nuxtApp.$auth, manager.email, manager.password)
        if(response) {
          await setUserAccountType(response.user.uid, manager)
        }
      } catch (e) {
        console.log(e)
      }
      finally {
        loading.value = false
        manager.email = '',  
        manager.password = ''
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

</script>

<style scoped>

</style>