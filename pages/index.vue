<template>
  <NuxtParticles
    id="tsparticles"
    :options="options"
    @load="onLoad"
  >  
  </NuxtParticles>

  <div class="flex items-center h-screen">
    <div class="">  
      <div class="flex justify-center items-center">
        <div class="bg-white rounded-b-[5em]">
          <img class="w-[5em]" src="/snapbill-logo.png" />
        </div>
      </div>
    
      <div class="flex justify-center md:mt-[3em] bg-white">
        <p class="lg:w-[50%] text-center md:text-2xl text-slate-500 font-bold px-4 mt-4">
          Welcome to Snapbill, our Receipt and Inventory App!
        </p>
      </div>
        
      <div class="bg-white mt-[3em] px-4">
        <div class="">
          <NuxtLink to="/auth/signin">
            <el-button class="flex m-auto w-full" type="primary">
              Sign In
            </el-button>
          </NuxtLink>

          <NuxtLink to="/auth/signup">
            <el-button class="flex m-auto w-full mt-[1em]" type="primary">
              Sign Up
            </el-button>
          </NuxtLink>
        </div>  
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Container } from 'tsparticles-engine'

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
      value: 50
    }
  }
}
const onLoad = (container: Container) => {
  // Do something with the container
  container.pause()
  setTimeout(() => container.play(), 500)
}
</script>

<style scoped>
::v-deep(.el-button) {
  @apply bg-sky-600 text-white py-[1.5em] rounded-xl w-full
}

::v-deep(.el-button):hover {
  @apply bg-sky-500 text-white py-[1.5em] rounded-xl 
}
</style>