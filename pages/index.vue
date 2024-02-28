<template>
  <NuxtParticles
    id="tsparticles"
    :options="options"
    @load="onLoad"
  >  
  </NuxtParticles>

  <div>
    Welcome, Kindly sign in
    <NuxtLink class="border-2" to="/auth/signin">Sign In</NuxtLink>
    <NuxtLink class="border-2" to="/auth/signup">Sign Up</NuxtLink>
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
      value: 100
    }
  }
}
const onLoad = (container: Container) => {
  // Do something with the container
  container.pause()
  setTimeout(() => container.play(), 500)
}
</script>