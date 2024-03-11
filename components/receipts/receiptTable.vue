<template>
  <div class="py-[5.5em] px-[1em] md:px-[5em] lg:px-[15em] relative">
    <div class="grid grid-cols-2">
      <h1 class="font-semibold text-xl text-gray-500">
        <Icon name="material-symbols:receipt-long-outline" color="gray" size="25" />
        <span class=""> Receipts ({{ store.receipts.length }})</span>
      </h1>
      <div class="flex gap-x-[1em]">
        <el-input
          v-model="search"
          placeholder="Search for a product receipt"
          :prefix-icon="Search"
        />
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Create receipt"
          placement="bottom"
        >
          <NuxtLink class="" to="/addReceipts"> 
            <el-button
              type="primary"
              plain
            >
              <Icon name="mdi:receipt-text-plus" size="20" />
            </el-button>
          </NuxtLink> 
        </el-tooltip>
      </div>
    </div>

    <div v-if="dialogVisible" class="fixed inset-0 flex items-center justify-center z-50 px-[1em]">
      <div @click="handleCancel" class="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div class="m-auto dialog shadow-lg rounded-xl p-[2em] z-50 bg-white">
        <span class="text-sm text-gray-500 flex gap-x-[0.5em]">
          <span class="">Please enter password to delete this receipt</span>
          <Icon name="uis:padlock" size="20" color="gray" />
        </span>
        <el-input
          class="mt-[1em]"
          v-model="password"
          placeholder="Enter your password"
          clearable
        />
        <div class="h-[1em]">
          <p class="text-red-500 text-xs mt-[0.3em]">{{ passwordError }}</p>
        </div>
        <span slot="footer" class="dialog-footer justify-between flex mt-[0.5em]">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="validatePassword">Confirm</el-button>
        </span>
      </div>
    </div>

    <div v-loading="loading" class="mt-[1em] z-0">
      <el-table 
        :default-sort="{ prop: 'date', order: 'descending' }" 
        :border="parentBorder"
        v-if="store.receipts.length > 0" 
        :data="paginatedReceipts" 
        style="width: 100%; max-height: 100%;"
      >
        <el-table-column fixed type="selection" width="40" />
        <el-table-column width="130" prop="customerName" label="CUSTOMER">
          <template #default="scope">
            <span @click="viewR(scope.row.id)">
              {{ scope.row.customerName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="PRODUCT" width="200" />
        <el-table-column prop="swapFrom" label="SWAPPED FROM" width="200">
          <template #default="{ row }">
            <span v-if="row.swapFrom">{{ row.swapFrom }}</span>
            <span v-else>None</span>
          </template>
        </el-table-column>
        <el-table-column prop="paidVia" width="100" label="PAID VIA" >
          <template #default="{ row }">
            <div 
              :class="
                { 'text-orange-500': row.paidVia === 'Usdt', 
                  'text-gray-500': row.paidVia === 'Cash',
                  'text-green-500': row.paidVia === 'Pos',
                  'text-blue-500': row.paidVia === 'Transfer'
                }"
            >
              {{ row.paidVia }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productDescription" width="400" label="DESCRIPTION" />
        <el-table-column prop="date" sortable label="DATE" width="150"/>
        <el-table-column fixed="right" width="61">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Duplicate"
              placement="left"
            >
              <el-button
                size="small"
                type="primary"
                @click="dupR(scope.row.id)"
              >
                <Icon name="ic:twotone-file-copy" color="white" size="12" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="isAdmin" fixed="right" width="61">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Delete"
              placement="right"
            >
              <el-button
                size="small"
                type="danger"
                @click="delR(scope.row.id)"
              >
                <Icon name="ic:twotone-delete" color="white" size="12" />
              </el-button>
            </el-tooltip>  
          </template>
        </el-table-column>
      </el-table>
      
  
      <el-empty v-else>
        <NuxtLink to="/addReceipts">
          <el-button type="primary">Generate Receipt</el-button>
        </NuxtLink>
      </el-empty>

      <div class="fixed bottom-3 pt-[1em] right-[1em] md:right-[5em] lg:right-[15em] bg-white">
        <vue-awesome-paginate
          v-model="currentPage"
          :total-items="store.receipts.length"
          :items-per-page="10"
          :max-pages-shown="5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { Search } from '@element-plus/icons-vue'
import { useAuthStore } from "~/store/users"

const store = useStore()
const authStore = useAuthStore()
const router = useRouter()
const parentBorder = ref(true)
const loading = ref(true)
const dialogVisible = ref(false)
const password = ref('')
const incorrectPassword = ref(false);
let deleteId = ref('')
const currentPage = ref(1)
const search = ref('')

const deleteSuccess = () => {
  ElMessage({
    message: 'Receipt deleted successfully',
    type: 'success',
  })
}

const isAdmin = computed(() => {
  return authStore.currentUser?.accountType === 'admin'
})

const passwordError = computed(() => {
  if(incorrectPassword.value == true){
    return 'Incorrect Password!'
  }
})

const searchR = computed(() => {
  return store.receipts.filter(r => {
    return r.productName.toLowerCase().includes(search.value.toLowerCase());
  });
})

const delR = (id:any) => {
  deleteId = id;
  dialogVisible.value = true;
}

const handleCancel = () => {
  dialogVisible.value = false;
  password.value = '';
  incorrectPassword.value = false;
};

const handleDelete = () => {
  store.deleteReceipt(deleteId);
  deleteSuccess();
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

const dupR = (id:any) => {
  router.push({path:`/dupReceipt/${id}`})
}

const viewR = (id:any) => {
  router.push({path:`/receipt/${id}`})
}

const paginatedReceipts = computed(() => {
  const start = (currentPage.value - 1) * 10
  const end = start + 10
  return searchR.value.slice(start, end)
});

onMounted(() => {
  authStore.loadCurrentUserFromStorage()
  if(paginatedReceipts) {
    loading.value = false
  }
})

</script>

<style scoped>
::v-deep(.el-table__header th) {
  color: #4b5563;
  font-weight: semibold;
  font-size: 1em
}

::v-deep(.el-table__header-wrapper) {
  border-bottom: 1px solid #d1d5db;
}

::v-deep(.el-table__row) {
  font-size: 1em;
}

@media screen and (max-width: 768px) {
  ::v-deep(.el-table__row) {
    font-size: 0.8em;
    font-weight: 300;
  }
}

.el-table tr {
  @apply text-[0.75em] md:text-[0.9em]
}

.pagination-container {
  display: flex;
  gap: 0.5em;
  margin-top: 2em;
  font-size: 0.7em;
}

::v-deep(.paginate-buttons){
  border: 1px solid #E2E8F0;
  padding: 0.5rem;
  height: 3em;
  width: 3em;
  border-radius: 0.5em;
}

::v-deep(.paginate-buttons:hover){
  background-color: #0055ffc2; /* Assuming e-primary is a blue color */
  color: white;
  border: none;
  border-radius: 0.5em;
  transition: background-color 300ms;
}

::v-deep(.active-page){
  background-color: #0055ffc2; /* Assuming e-primary is a blue color */
  color: white;
  height: 3.3em;
  width: 3.3em;
  border-radius: 0.5em;
}
</style>