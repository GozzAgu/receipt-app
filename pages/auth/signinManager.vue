<template>
  <LoadersSignoutLoader v-if="loading" />
  <NuxtParticles
    id="tsparticles"
    :options="options"
    @load="onLoad"
  >  
  </NuxtParticles>

  <el-form
    ref="ruleFormRef"
    :model="manager"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm md:w-full px-[3em] md:p-[2em] md:py-[2em] md:px-[4em] md:shadow-md mt-[3em] bg-white"
    status-icon
    :label-position="labelPosition"
    style="max-width: 500px"
  >
    <img class="lg:hidden w-[3em] m-auto mb-8" src="/snapbill-logo.png"/>

    <div>
      <h2 class="text-center lg:text-left text-gray-500 text-[1.5em] md:text-[2.5em] mb-[0.5em]">Sign In</h2>
      <p class="text-sm text-gray-500 mb-[1em]">
        Welcome back, Please enter your credentials to get signed into your account.
        
      </p>
    </div>
    
    <el-form-item label="Email" prop="email">
      <el-input v-model="manager.email" />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input type="password" v-model="manager.password" />
    </el-form-item>
    <el-form-item class="mt-[2em]">
      <el-button class="flex m-auto w-full" type="primary" @click="submitForm(ruleFormRef)">
        <Icon v-if="loading" class="mr-2" name="svg-spinners:gooey-balls-1" />
        Sign In
      </el-button>
    </el-form-item>
    <NuxtLink to="/auth/signin">
      <span class="text-xs text-gray-500 hover:underline hover:text-blue-400 cursor-pointer">If you're an admin, click here</span>
    </NuxtLink>
    <div class="flex justify-between">
      <NuxtLink to="/auth/signup">
        <p class="hover:underline text-xs text-gray-500 mt-[3em]">Don't have an account?</p>
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
import { useAuthStore } from '~/store/users';

definePageMeta({
  layout:'auth'
});

// const isLoading = ref(false)
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

const nuxtApp = useNuxtApp()
const router = useRouter()
const loading = ref(false)
const store = useAuthStore()

const labelPosition = ref<FormProps['labelPosition']>('top')

interface RuleForm {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  accountType: AccountType
}

const ruleFormRef = ref<FormInstance>()
const manager = reactive<RuleForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  accountType: AccountType.Manager,
})

const rules = reactive<FormRules<RuleForm>>({
  email: [
    { required: true, message: 'Email required', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be up to 3', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password required', trigger: 'blur' },
    { min: 6, max: 30, message: 'Password cannot be less than 6', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        const response = await store.signin(manager.email, manager.password, manager.accountType)
        try {
          await updateProfile(nuxtApp.$auth.currentUser!, {
            displayName: manager.email
          });
        } catch (error) {
          console.error(error);
        }
        ElNotification({
          title: 'Success',
          message: 'Sign in successful',
          type: 'success',
        })
        if(manager.accountType === AccountType.Manager) {
          router.push('/')
        }else {
          router.push('/receiptTable')
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
        loading.value = false
        manager.email = '',
        manager.password = ''
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>