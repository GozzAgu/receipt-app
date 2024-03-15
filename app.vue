<template>
  <NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<script setup>
import { useAuthStore } from './store/users'

useHead({
	htmlAttrs: {
		lang: 'en'
	},
	bodyAttrs: {
		class: 'font-albert'
	},
	link: [
		{ rel: 'icon', href: '/snapbill-logo.png' }
	],
	title: 'snapbill',
})

const store = useAuthStore()

onMounted(() => {
	store.loadCurrentUserFromStorage()
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>