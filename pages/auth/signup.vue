<template>
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
      <h2 class="text-center lg:text-left text-gray-500 text-[1.5em] md:text-[2.5em] mb-[0.5em]">Sign Up</h2>
      <p class="text-sm text-gray-500 mb-[1em]">
        Get started, Please enter your credentials to get signed into your account.
      </p>
    </div>
    
    <el-form-item label="Email" prop="email">
      <el-input v-model="ruleForm.email" />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="ruleForm.password" />
    </el-form-item>
    <el-form-item label="Confirm Password" prop="email">
      <el-input v-model="ruleForm.confirmPassword" />
    </el-form-item>
    <el-form-item class="mt-[2em]">
      <el-button class="flex m-auto w-full" type="primary" @click="submitForm(ruleFormRef)">
        <Icon v-if="loading" class="mr-2" name="svg-spinners:gooey-balls-1" />
        Sign Up
      </el-button>
    </el-form-item>
    <div class="">
      <NuxtLink to="/auth/signin">
        <p class="hover:underline text-sm text-gray-500 mt-[3em]">Already have an account?</p>
      </NuxtLink>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, FormProps } from 'element-plus'
import { updateProfile, createUserWithEmailAndPassword, type Auth } from '@firebase/auth';
import type { Container } from 'tsparticles-engine'

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
  // Do something with the container
  container.pause()
  setTimeout(() => container.play(), 500)
}

const router = useRouter()
const loading = ref(false)
const nuxtApp = useNuxtApp()

const labelPosition = ref<FormProps['labelPosition']>('top')

interface RuleForm {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  type: string[]
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: [],
})

const matchPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
      callback(new Error('Confirm Password is required'));
  }else if (value !== ruleForm.password) {
      callback(new Error('Password does not match'));
  } else {
      callback();
  }
}

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Email required', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be up to 3', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Email required', trigger: 'blur' },
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

const setDisplayName = async() => {
  const user = nuxtApp.$auth.currentUser;
  try {
    await updateProfile(nuxtApp.$auth.currentUser!, {
      displayName: ruleForm.name,
    });

    console.log('User profile updated:', user);
  } catch (error) {
    console.error('Error updating display name:', error);
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        const response = await createUserWithEmailAndPassword(nuxtApp.$auth, ruleForm.email, ruleForm.password) 
        if(response) {
          try {
            await updateProfile(nuxtApp.$auth.currentUser!, {
                displayName: ruleForm.email
            });
            
            console.log(response.user.uid);
            
            console.log(nuxtApp.$auth.currentUser?.displayName);
            console.log(response);
        } catch (error) {
            // Handle errors here
            console.error(error);
        }
          setDisplayName()
          ElNotification({
            title: 'Success',
            message: 'Account created successfully',
            type: 'success',
          })
          router.push('/dashboard')
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
        ruleForm.email = '',  
        ruleForm.password = ''
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
