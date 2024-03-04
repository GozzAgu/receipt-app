<template>
  <div class="">    
    <div v-loading="loading" class=" bg-white py-[0.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-blue-400">Receipt delete password</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="passwordG"
        status-icon
        :rules="passwordRules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">

          <el-form-item label="New password" prop="newPassword">
            <el-input v-model="passwordG.newPassword" placeholder="" />
          </el-form-item>
          <el-form-item label="Confirm password" prop="confirmNewPassword">
            <el-input v-model="passwordG.confirmNewPassword" placeholder="" />
          </el-form-item>
        </div>
        <el-button class="mt-[2em]" type="primary" @click="addR(ruleFormRef)">
          <el-icon><Tickets /></el-icon>
          <span class="ml-[1em] text-[0.7em] md:text-base">Submit</span>
        </el-button>
      </el-form>

      <el-divider content-position="right"><span class="text-lg text-blue-400">Receipt password reset</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="passwordReset"
        status-icon
        :rules="resetPasswordRules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">

          <el-form-item label="Old password" prop="oldPassword">
            <el-input v-model="passwordReset.oldPassword" placeholder="" />
          </el-form-item>
          <el-form-item label="New password" prop="newPassword">
            <el-input v-model="passwordReset.newPassword" placeholder="" />
          </el-form-item>
          <el-form-item label="Confirm new password" prop="confirmNewPassword">
            <el-input v-model="passwordReset.confirmNewPassword" placeholder="" />
          </el-form-item>
        </div>
        <div class="flex justify-end">
          <el-button class="mt-[2em]" type="primary" @click="addR(ruleFormRef)">
            <el-icon><Tickets /></el-icon>
            <span class="ml-[1em] text-[0.7em] md:text-base">Submit</span>
          </el-button>
        </div>
      </el-form>      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { ReceiptPasswordReset, ReceiptPassword } from '@/types/types'
import { Tickets, Back } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

let passwordG = reactive<ReceiptPassword>({
  newPassword: '',
  confirmNewPassword: '',
})

let passwordReset = reactive<ReceiptPasswordReset>({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const passwordRules = reactive<FormRules<ReceiptPassword>>({
  newPassword: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
  confirmNewPassword: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
})

const resetPasswordRules = reactive<FormRules<ReceiptPasswordReset>>({
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