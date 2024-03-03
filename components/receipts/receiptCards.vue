<template>
  <div class="py-[6em] px-[1em] md:px-[5em] lg:px-[15em]">
    <!-- <div class="loader"></div>
    <p class="p-[0.5em] my-[1em] text-center text-red-300 font-thin">
      app in progress...
    </p> -->

    <el-dialog
      title="Confirmation"
      v-model="dialogVisible"
      center
    >
      <span>Please enter password to delete this receipt</span>
      <el-input
        class="mt-[1em]"
        v-model="password"
        type="password"
        placeholder="Enter your password"
        clearable>
      </el-input>
      <span v-if="incorrectPassword" class="text-red-500">Incorrect password. Please try again.</span>
      <span slot="footer" class="dialog-footer justify-between flex mt-[1em]">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="validatePassword">Go</el-button>
      </span>
    </el-dialog>

    <div v-loading="loading" class="mt-[2em]">
      <el-table 
        :default-sort="{ prop: 'date', order: 'descending' }" 
        :border="parentBorder" v-if="store.receipts.length >0" 
        :data="store.receipts" 
        style="width: 100%; max-height: 100%;"
      >
        <el-table-column fixed  width="130" prop="customerName" label="Customer">
          <template #default="scope">
            <span @click="viewR(scope.row)">
              {{ scope.row.customerName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column @click="viewR(scope.row)" prop="productName" label="Product" width="250" />
        <el-table-column @click="viewR(scope.row)" prop="productDescription" width="420" label="Description" />
        <el-table-column @click="viewR(scope.row)" prop="date" sortable label="Date" width="150"/>
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
const loading = ref(true)
const dialogVisible = ref(false)
const password = ref('')
const incorrectPassword = ref(false);
let deleteId = ref(null)

const delR = (id) => {
  deleteId = id.id;
  dialogVisible.value = true;
}

const handleCancel = () => {
  dialogVisible.value = false;
  password.value = '';
  incorrectPassword.value = false;
};

const handleDelete = () => {
  store.deleteReceipt(deleteId);
  dialogVisible.value = false;
}

const validatePassword = () => {
  const userPassword = 'password';
  if (password.value === userPassword) {
    handleDelete();
  } else {
    incorrectPassword.value = true
  }
};

const dupR = (id) => {
  router.push({path:`/dupReceipt/${id.id}`})
}

const viewR = (id) => {
  router.push({path:`/receipt/${id.id}`})
}

onMounted(() => {
  onAuthStateChanged(nuxtApp.$auth, (user) => {
      if(user) {

      } else {

      }
      store.fetchReceipts();
      loading.value = false
    });
})
</script>

<style >
.el-table tr {
  @apply text-[0.75em] md:text-[0.9em]
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