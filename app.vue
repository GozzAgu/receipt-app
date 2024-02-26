<template>
  <NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<script setup>
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
});
</script>

<style>

</style>