<template>
  
</template>
<!-- <template>
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
    :rules="passwordRules"
    label-width="120px"
    class="demo-ruleForm md:w-full px-[3em] md:p-[2em] md:py-[2em] md:px-[4em] md:shadow-md mt-[3em] bg-white"
    status-icon
    :label-position="labelPosition"
    style="max-width: 500px"
  >
    <img class="lg:hidden w-[3em] m-auto mb-8" src="/snapbill-logo.png"/>
    
    <div>
      <h2 class="text-center lg:text-left text-gray-500 text-[1.5em] md:text-[2.5em] mb-[0.5em]">Sign In</h2>
      <p class="text-sm text-gray-500 mb-[1em]">Welcome back, Please enter your credentials to get signed in as a manager.</p>
    </div>
    
    <el-form-item label="Username" prop="username">
      <el-input v-model="manager.username" />
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
import type { Container } from 'tsparticles-engine'
import { AccountType, type Manager, type ManagerAuth } from '~/types/types';
import { useStore } from '@/store/users'

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
  container.pause()
  setTimeout(() => container.play(), 500)
}

const store = useStore()
const nuxtApp = useNuxtApp()
const router = useRouter()
const loading = ref(false)

const labelPosition = ref<FormProps['labelPosition']>('top')

const ruleFormRef = ref<FormInstance>()
const manager = reactive<ManagerAuth>({
  username: '',
  password: '',
})

const passwordRules = reactive<FormRules<Manager>>({
  username: [
    { required: true, message: 'Please input a username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  const valid = await formEl.validate();
  if (!valid) {
    console.log('Form validation failed');
    return;
  }

  loading.value = true;

  try {
    if (manager.username && manager.password) {
      let managerExists = store.users.filter(m => m.manager.username === manager.username);
      console.log(managerExists, store.users)

      if (managerExists) {
        const managerWithPassword = store.users.find(m => m.manager.username === manager.username && m.manager.password === manager.password)
        if (managerWithPassword) {
          router.push('/users')
          console.log('Correct password');
        } else {
          console.log('Incorrect password');
        }
      } else {
        console.log('Manager does not exist');
        ElNotification({
          title: 'Error',
          message: 'Manager does not exist',
          type: 'error',
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    ElNotification({
      title: 'Error',
      message: 'An error occurred while processing your request',
      type: 'error',
    });
  } finally {
    loading.value = false;
    manager.username = '';
    manager.password = '';
  }
};

onMounted(() => {
  store.fetchManagers()
})
</script> -->