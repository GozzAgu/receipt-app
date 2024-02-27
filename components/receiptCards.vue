<template>
  <div class="py-[6em] px-[1em] ">

    <div class="loader"></div>
    <p class="p-[0.5em] my-[1em] text-center text-red-300 font-thin">
      app in progress...
    </p>

    <div>
      <ReceiptCard v-if="store.receipts.length >0"/>
  
      <el-empty v-else>
        <NuxtLink to="/addReceipts">
          <el-button type="primary">Generate Receipt</el-button>
        </NuxtLink>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../store"

const store = useStore()

onMounted(() => {
  store.fetchReceipts()
})
</script>

<style>
.loader {
  width: 28px;
  height: 28px;
  margin: auto;
  position: relative;
}

.loader:before {
  content: '';
  width: 28px;
  height: 5px;
  background: #c5631350;
  position: absolute;
  top: 40px;
  left: 0;
  border-radius: 50%;
  animation: shadow324 0.5s linear infinite;
}

.loader:after {
  content: '';
  width: 100%;
  height: 100%;
  background: #f08080;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  animation: jump7456 0.5s linear infinite;
}

@keyframes jump7456 {
  15% {
    border-bottom-right-radius: 3px;
  }

  25% {
    transform: translateY(9px) rotate(22.5deg);
  }

  50% {
    transform: translateY(18px) scale(1, .9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }

  75% {
    transform: translateY(9px) rotate(67.5deg);
  }

  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes shadow324 {

  0%,
    100% {
    transform: scale(1, 1);
  }

  50% {
    transform: scale(1.2, 1);
  }
}
</style>