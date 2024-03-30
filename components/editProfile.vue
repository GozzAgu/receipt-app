<template>
  <div class="">    
    <div v-loading="loading" class=" bg-white py-[0.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-sky-600">Edit Profile</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="user"
        status-icon
        :rules="passwordRules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">
          
          <el-form-item label="Company name" prop="name">
            <el-input v-model="user.name" placeholder="" />
          </el-form-item>
          <el-form-item label="Company email" prop="email">
            <el-input v-model="user.email" placeholder="" />
          </el-form-item>
          <el-form-item label="Company phone number" prop="phone">
            <el-input v-model="user.phone" placeholder="" />
          </el-form-item>
        </div>
        <NuxtLink 
          class="
            w-[100%]
            md:w-[30%]
            cursor-pointer
            bg-sky-600 
            hover:bg-sky-500 
            transition 
            duration-500 
            hover:shadow-lg 
            rounded-lg 
            flex 
            justify-center 
            items-center
            py-[0.3rem]
            mt-[2rem]" 
          @click="addR(ruleFormRef)"
        > 
          <Icon class="text-white ml-[0.5rem]" name="tabler:user-plus" size="15" />
          <span class="ml-[0.2em] text-[0.3em] md:text-base text-white font-thin">Update</span>
        </NuxtLink> 
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { User } from '@/types/types'
import { Tickets } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

let user = reactive<User>({
  email: '',
  name: '',
  phone: ''
})

const passwordRules = reactive<FormRules<User>>({
  email: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
  name: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
})

onMounted(() => {
  store.fetchReceipts()
})

const addR = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

</script>

<style scoped>

</style>