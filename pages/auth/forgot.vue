<template>
  <SignoutLoader v-if="isLoading" />
  <NuxtParticles
    id="tsparticles"
    :options="options"
    @load="onLoad"
  >  
  </NuxtParticles>

  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
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
      <p class="text-sm text-gray-500 mb-[1em]">Welcome back, Please enter your credentials to get signed into your account.</p>
    </div>
    
    <el-form-item label="Email" prop="email">
      <el-input v-model="ruleForm.email" />
    </el-form-item>
    <el-form-item class="mt-[2em]">
      <el-button class="flex m-auto w-full" type="primary" @click="submitForm(ruleFormRef)">
        <Icon v-if="loading" class="mr-2" name="svg-spinners:gooey-balls-1" />
        Sign In
      </el-button>
    </el-form-item>
    <div class="">
      <NuxtLink to="/auth/signup">
        <p class="hover:underline text-sm text-gray-500 mt-[3em]">Don't have an account?</p>
      </NuxtLink>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, FormProps } from 'element-plus'
import { type Auth, sendPasswordResetEmail } from '@firebase/auth';
import type { Container } from 'tsparticles-engine'


definePageMeta({
  layout:'auth'
});

const isLoading = ref(false)

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

const labelPosition = ref<FormProps['labelPosition']>('top')

interface RuleForm {
  email: string,
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  email: '',
})

const rules = reactive<FormRules<RuleForm>>({
  email: [
    { required: true, message: 'Email required', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be up to 3', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      isLoading.value = true
      try {
        await sendPasswordResetEmail(nuxtApp.$auth, ruleForm.email)
        ElNotification({
          title: 'Success',
          message: 'Password reset email sent successfully',
          type: 'success',
        })
        router.push('/auth/signin')
      } catch (error) {
        ElNotification({
          title: 'Error',
          message: 'Failed to send password reset email',
          type: 'error',
        })
        console.error(error)
      } finally {
        isLoading.value = false
        ruleForm.email = ''
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>