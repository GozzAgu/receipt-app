<template>
  <!-- <LoadersSignoutLoader v-if="isLoading" /> -->
  <NuxtParticles
    id="tsparticles"
    :options="options"
    @load="onLoad"
  >  
  </NuxtParticles>

  <el-form
    ref="ruleFormRef"
    :model="admin"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm md:w-full px-[2em] py-[2em] md:py-[2em] md:px-[3em] md:shadow-md mt-[3em] bg-white"
    status-icon
    :label-position="labelPosition"
    style="max-width: 500px"
  >
    <img class="lg:hidden w-[3em] m-auto mb-8" src="/snapbill-logo.png"/>
    
    <div>
      <h2 class="text-center lg:text-left text-gray-500 text-[1.5em] md:text-[2.5em] mb-[0.5em]">Sign Up</h2>
      <p class="text-sm text-gray-500 mb-[1em]">
        Get started, Please enter your credentials to get signed into your account.
      </p>
    </div>

    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="admin.imageUrl" :src="admin.imageUrl" class="avatar w-[3em]" />
      <el-icon v-else class="avatar-uploader-icon  border"><Plus /></el-icon>
    </el-upload>

    <div class="md:grid grid-cols-2 gap-x-[1.5rem]">
      <el-form-item label="Company name" prop="name">
        <el-input v-model="admin.adminName" />
      </el-form-item>
      <el-form-item label="Company email" prop="email">
        <el-input v-model="admin.email" />
      </el-form-item>
    </div>
    <div class="md:grid grid-cols-2 gap-x-[1.5rem]">
      <el-form-item label="Company address" prop="address">
        <el-input v-model="admin.address" />
      </el-form-item>
      <el-form-item label="Company phone no" prop="phone">
        <el-input v-model="admin.phone" />
      </el-form-item>
    </div>
    <div class="md:grid grid-cols-2 gap-x-[1.5rem]">
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="admin.password" />
      </el-form-item>
      <el-form-item label="Confirm Password" prop="email">
        <el-input type="password" v-model="admin.confirmPassword" />
      </el-form-item>
    </div>
    
    <el-form-item class="mt-[2em]">
      <el-button class="flex m-auto w-full" @click="submitForm(ruleFormRef)">
        <Icon v-if="loading" class="mr-2" name="svg-spinners:gooey-balls-1" />
        Sign Up
      </el-button>
    </el-form-item>
    <div class="flex justify-between">
      <NuxtLink to="/auth/signin">
        <p class="hover:underline text-xs text-gray-500 mt-[3em]">Already have an account?</p>
      </NuxtLink>
      <NuxtLink to="/auth/forgot">
        <p class="hover:underline text-xs text-gray-500 mt-[3em]">Forgot password?</p>
      </NuxtLink>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, FormProps } from 'element-plus'
import { updateProfile } from '@firebase/auth';
import type { Container } from 'tsparticles-engine'
import { AccountType } from '~/types/types';
import { doc, setDoc } from "firebase/firestore"; 
import { useAuthStore } from '~/store/users';
import type { UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

definePageMeta({
  layout:'auth'
});

const isLoading = ref(false)
const router = useRouter()
const loading = ref(false)
const nuxtApp = useNuxtApp()
const store = useAuthStore()
const labelPosition = ref<FormProps['labelPosition']>('top')

const options = {
  fullScreen: {
    enable: true,
    zIndex: -1
  },
  background: {
    color: {
      value: '#fff'
    }
  },
  particles: {
    color: {
      value: "#dce8f7"
    },
    links: {
      color: "#e9eff7",
      enable: true
    },
    move: {
      enable: true
    },
    number: {
      value: 100
    }
  }
}
const onLoad = (container: Container) => {
  // Do something with the container
  container.pause()
  setTimeout(() => container.play(), 500)
}

interface RuleForm {
  adminName: string,
  address: string,
  email: string,
  phone: string,
  imageUrl: string,
  password: string,
  confirmPassword: string,
  accountType: AccountType
}

const ruleFormRef = ref<FormInstance>()
const admin = reactive<RuleForm>({
  adminName: '',
  address: '',
  email: '',
  phone: '',
  imageUrl: '',
  password: '',
  confirmPassword: '',
  accountType: AccountType.Admin,
})

const matchPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
      callback(new Error('Confirm Password is required'));
  }else if (value !== admin.password) {
      callback(new Error('Password does not match'));
  } else {
      callback();
  }
}

const rules = reactive<FormRules<RuleForm>>({
  adminName: [
    { required: true, message: 'Name required', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be up to 3', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Email required', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be up to 3', trigger: 'blur' },
  ],
  address: [
    { required: true, message: 'Address required', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be up to 3', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: 'Phone number required', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be up to 3', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password required', trigger: 'blur' },
    { min: 6, max: 30, message: 'Password cannot be less than 6', trigger: 'blur' },
  ],
  confirmPassword: [
    { validator: matchPassword,  trigger: 'change' },
    { required: true, message: 'Password required', trigger: 'blur' },
    { min: 6, max: 30, message: 'Password cannot be less than 6', trigger: 'blur' },
  ],
})

const setUserAccountType = async (userId: string, admin: RuleForm) => {
  const userDocRef = doc(nuxtApp.$firestore, 'users', userId)
  await setDoc(userDocRef, { ...admin }, { merge: true })
};

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  if (uploadFile.raw) {
    admin.imageUrl = String(URL.createObjectURL(uploadFile.raw))
  } else {
    console.error("Upload file raw is null")
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        const response = await store.signupAdmin(admin.email, admin.password, admin.accountType)
        if(response) {
          try {
            await setUserAccountType(response.user.uid, admin)
        } catch (error) {
            console.error(error)
        }
          ElNotification({
            title: 'Success',
            message: 'Account created successfully',
            type: 'success',
          })
          if(admin.accountType === AccountType.Manager) {
            router.push('/signin')
          }else {
            router.push('/auth/signin')
          }
        }
      }
      catch(error) {
        ElNotification({
          title: 'Error',
          message: 'Incorrect details',
          type: 'error',
        })
        console.log(error)
      } 
      finally {
        isLoading.value = false
        admin.email = '',  
        admin.password = ''
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  store.fetchManagers()
})
</script>

<style scoped>
::v-deep(.el-button) {
  @apply bg-sky-600 text-white py-[1.5em] rounded-xl 
}

::v-deep(.el-button):hover {
  @apply bg-sky-500 text-white py-[1.5em] rounded-xl 
}

::v-deep(.el-input__wrapper) {
  @apply py-[0.5em] rounded-xl 
}

::v-deep(.el-input__wrapper):focus {
  @apply bg-gray-200 text-white py-[0.5em] rounded-xl 
}
</style>
