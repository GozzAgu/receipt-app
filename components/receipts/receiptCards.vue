<template>
  <div class="py-[6em] px-[1em] md:px-[5em] lg:px-[15em]">
    <div class="loader"></div>
    <p class="p-[0.5em] my-[1em] text-center text-red-300 font-thin">
      app in progress...
    </p>

    <div class="mt-[2em]">
      <el-table :border="parentBorder" v-if="store.receipts.length >0" :data="store.receipts" style="width: 100%; max-height: 100%;">
        <el-table-column fixed prop="customerName" label="Customer" />
        <el-table-column prop="productName" label="Product" width="200" />
        <el-table-column prop="productDescription" label="Description" width="350" />
        <el-table-column prop="date" label="Date" width="100"/>
        <el-table-column fixed="right" width="110">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="dupR(scope.row)"
            >
              <el-icon><CopyDocument /></el-icon>
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="delR(scope.row)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-empty v-else>
        <NuxtLink to="/addReceipts">
          <el-button type="primary">Generate Receipt</el-button>
        </NuxtLink>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../store/receipts"
import { onAuthStateChanged } from '@firebase/auth'
import { Delete, CopyDocument } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const nuxtApp = useNuxtApp()
const parentBorder = ref(true)

const delR = (id) => {
  store.deleteReceipt(id.id);
  console.log(id.id)
};

const dupR = (id) => {
  router.push({path:`/dupReceipt/${id.id}`})
}

onMounted(() => {
  onAuthStateChanged(nuxtApp.$auth, (user) => {
      if(user) {
        // isLoggedIn.value = true;
        // displayName.value = nuxtApp.$auth.currentUser.email;
      } else {
        // isLoggedIn.value = false;
      }
      store.fetchReceipts();
    });
})
</script>

<style >
.el-table tr {
  @apply text-[0.75em] md:text-[0.9em] font-thin
}

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