<template>
  <div class="shadow-md fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em]">
      <NuxtLink class="flex gap-x-[0.5em]" to="/">
        <img class="w-[2em]" src="/public/snapbill-logo.png" />
        <p class="font-bold text-lg text-sky-600">snapB!LL</p>
      </NuxtLink>
      
      <NuxtLink to="/addReceipts">
        <el-button plain type="primary" @click="exportToPDF('my-pdf-file.pdf', pdfSection)">
          <span>Generate Receipt</span>
        </el-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>

</script>