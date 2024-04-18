<template>
  <!-- <LoadersSignoutLoader v-if="loading" /> -->
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
    class="demo-ruleForm md:w-full px-[3em] md:p-[2em] md:py-[2em] md:px-[4em] md:shadow-md mt-[3em] bg-white"
    status-icon
    :label-position="labelPosition"
    style="max-width: 500px"
  >
    <div class="mt-[15rem] md:mt-0" v-if="signedIn">
      <iframe src="https://lottie.host/embed/9a17bc17-7601-456c-a6b5-e6d582eed5c7/jW0yGQSbAJ.json"></iframe>
      <p class="text-center text-gray-500 font-semibold text-xl">Admin sign in successful</p>
    </div>

    <div v-else>
      <img class="lg:hidden w-[3em] m-auto mb-8" src="/snapbill-logo.png"/>
      
      <div>
        <h2 class="text-center lg:text-left text-gray-500 text-[1.5em] md:text-[2.5em] mb-[0.5em]">Sign In</h2>
        <p class="text-sm text-gray-500 mb-[1em]">
          Welcome back, Please enter your credentials to get signed into your account.
        </p>
      </div>
      
      <el-form-item label="Email" prop="email">
        <el-input v-model="admin.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="admin.password" />
      </el-form-item>
      <el-form-item class="mt-[2em]">
        <el-button class="flex m-auto w-full" type="primary" @click="submitForm(ruleFormRef)">
          <Icon v-if="loading" class="mr-2" name="svg-spinners:gooey-balls-1" />
          Sign In
        </el-button>
      </el-form-item>
      <NuxtLink to="/auth/signinManager">
        <span class="text-xs text-gray-500 hover:underline hover:text-blue-400 cursor-pointer">If you're not an admin, click here</span>
      </NuxtLink>
      <div class="flex justify-between">
        <NuxtLink to="/auth/signup">
          <p class="hover:underline text-xs text-gray-500 mt-[3em]">Don't have an account?</p>
        </NuxtLink>
        <NuxtLink to="/auth/forgot">
          <p class="hover:underline text-xs text-gray-500 mt-[3em]">Forgot password?</p>
        </NuxtLink>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, FormProps } from 'element-plus'
import { updateProfile, signOut } from '@firebase/auth';
import type { Container } from 'tsparticles-engine'
import { AccountType } from '~/types/types';
import { useAuthStore } from '~/store/users';

definePageMeta({
  layout:'auth'
});

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
  container.pause()
  setTimeout(() => container.play(), 500)
}

const nuxtApp = useNuxtApp()
const router = useRouter()
const loading = ref(false)
const store = useAuthStore()
const signedIn = ref(false)

const labelPosition = ref<FormProps['labelPosition']>('top')

interface RuleForm {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  accountType: AccountType
}

const ruleFormRef = ref<FormInstance>()
const admin = reactive<RuleForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  accountType: AccountType.Admin,
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
        const response = await store.signin(admin.email, admin.password, admin.accountType,)
        if(response) {
          try {
            const currentUser = await store.fetchCurrentUser(response.uid)
            if (currentUser?.accountType === 'admin'){
              signedIn.value = true
              setTimeout(() => {
                router.push('/dashboard')
              }, 3000)
            } else {
              ElNotification({
                title: 'Error',
                message: 'You are not authorized to sign in as an admin',
                type: 'error',
              })
              await signOut(nuxtApp.$auth)
              router.push('/auth/signin')
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
      catch(error) {
        ElNotification({
          title: 'Error',
          message: 'Incorrect details',
          type: 'error',
        })
      }
      finally {
        loading.value = false
        admin.email = '',
        admin.password = ''
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
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