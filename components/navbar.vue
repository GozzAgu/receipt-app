<template>
  <div class="shadow-md fixed top-0 bg-white w-[100%]">
    <div class="flex justify-between py-[1em] px-[1em]">
      <NuxtLink class="flex gap-x-[0.5em]" to="/">
        <img class="w-[2em]" src="/public/snapbill-logo.png" />
        <p class="font-bold text-lg text-sky-600">snapB!LL</p>
      </NuxtLink>

      <div class="flex gap-x-[0.3em]">
        <NuxtLink to="/addReceipts">
          <el-button plain type="primary">
            <span>Receipt</span>
          </el-button>
        </NuxtLink>
        <NuxtLink to="/addInvoice">
          <el-button plain type="primary">
            <span>Invoice</span>
          </el-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>