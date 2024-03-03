<template>
  <div class="px-[1em] md:px-[5em] lg:px-[15em] h-screen py-[5em] bg-blue-50">
    <NuxtLink to="/dashboard">
      <el-button class="mb-[1em]" type="primary">
        <el-icon><Back /></el-icon>
        <span class="ml-[1em] text-[0.7em] md:text-base">Back home</span>
      </el-button>
    </NuxtLink>
    
    <p class="text-gray-50 bg-blue-400 p-[1em] rounded-t-lg text-sm">
      Provide your previous password and current password.
    </p>

    <div v-loading="loading" class=" bg-white px-[1.5em] py-[2.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-blue-400">Receipt password reset</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="companyDetails"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">

          <el-form-item label="Old password" prop="customerName">
            <el-input v-model="receipt.oldPassword" placeholder="" />
          </el-form-item>
          <el-form-item label="New password" prop="customerAddress">
            <el-input v-model="receipt.newPassword" placeholder="" />
          </el-form-item>
          <el-form-item label="Confirm new password" prop="customerAddress">
            <el-input v-model="receipt.confirmNewPassword" placeholder="" />
          </el-form-item>
        </div>
      </el-form>

      <el-button class="mt-[2em]" type="primary" @click="addR(ruleFormRef)">
        <el-icon><Tickets /></el-icon>
        <span class="ml-[1em] text-[0.7em] md:text-base">Submit</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { ReceiptPasswordReset } from '@/types/types'
import { Tickets, Back } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

let receipt = reactive<ReceiptPasswordReset>({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const rules = reactive<FormRules<ReceiptPasswordReset>>({
  oldPassword: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
  confirmNewPassword: [
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