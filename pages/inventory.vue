<template>
    <SignoutLoader v-if="isSigningout" />
  
    <div class="py-[4.5em] mb-[4rem] px-[1em] md:px-[5em] lg:px-[5em] mx-auto">
        <div class="flex flex-col md:flex-row justify-between mb-8 gap-8">
            <div class="flex flex-col sm:flex-row gap-4">
                <el-input
                v-model="searchValue"
                size="large"
                placeholder="Search for an item..."
                :prefix-icon="Search"
                class="shadow-sm lg:max-w-[20rem]"
                style="width:100%"
                />
                <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    unlink-panels
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :shortcuts="shortcuts"
                    size="large"
                    format="M/DD/YYYY"
                    value-format="M/DD/YYYY"
                    clearable
                    class="shadow-sm lg:max-w-[20rem] date-picker-input"
                    style="width:100%"
                />
            </div>

            <div class="flex gap-4">
              <NuxtLink 
                @click="openAddDrawer"
                class="
                  bg-sky-600 hover:bg-sky-500 transition duration-500 
                  hover:shadow-lg rounded-lg flex justify-center 
                  items-center w-[10rem] text-white cursor-pointer py-[0.3em]"
              > 
                <Icon name="heroicons:plus-solid" :size="20" class="mr-2" />
                Add Entry
              </NuxtLink> 
            </div>
        </div>
        <div class="flex justify-between items-center font-light py-2 text-gray-500 text-xs sm:text-sm lg:px-3">
            <div class="flex gap-2 sm:gap-4 lg:gap-6 items-center">
                <p>{{ selected.length }} entries selected</p>
                <div class="flex gap-2 text-sm" v-if="selected.length > 0">
                    <button v-if="largerThanSm" @click="clearSelection" class="flex items-center justify-center gap-1 rounded px-2 py-1 hover:bg-gray-400/10">Clear selection</button>
                    <button v-if="selected.length == 1" class="flex text-sm items-center justify-center gap-1 text-purple-500 rounded px-2 py-1  hover:bg-purple-500/10"><Icon name="heroicons:eye" size="1em"/><span v-if="largerThanSm" class="text-sm">View</span></button>
                    <button class="flex items-center justify-center gap-1 text-red-400 rounded px-2 py-1 hover:bg-red-400/10"><Icon name="heroicons:trash-16-solid" size="1em" /><span v-if="largerThanSm" class="text-sm">Delete</span></button>
                </div>
            </div>
            <div class="relative">
                <button class="text-[#409eff] border-[1px] border-white hover:border-[#a0cfff] hover:bg-[#ecf5ff] px-2 py-1 rounded" @click="showDropDown = !showDropDown">
                Configure columns
                </button>

                <div class="shadow p-5 rounded absolute z-30 bg-white mt-4" v-if="showDropDown">
                    <el-checkbox-group v-model="columns" class="flex flex-col max-h-[10rem] overflow-scroll gap-4">
                        <el-checkbox label="Date In" value="dateIn" />
                        <el-checkbox label="Supplier" value="supplier" />
                        <el-checkbox label="Grade" value="grade" />
                        <el-checkbox label="Storage" value="storage" />
                        <el-checkbox label="IMEI" value="imei" />
                        <el-checkbox label="Colour" value="colour" />
                        <el-checkbox label="Amount" value="amount" />
                        <el-checkbox label="Cost" value="cost" />
                        <el-checkbox label="Margin" value="margin" />
                        <el-checkbox label="Swap" value="swap" />
                        <el-checkbox label="Date Out" value="dateOut" />
                        <el-checkbox label="Created By" value="createdBy" />
                        <el-checkbox label="Created At" value="createdAt" />
                        <el-checkbox label="Updated By" value="updatedBy" />
                        <el-checkbox label="Updated At" value="updatedAt" />
                    </el-checkbox-group>
                </div>
            </div>
        </div>

        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="All Inventory" name="first">
            <div class="bg-white p-[0.5rem] rounded-2xl">
                <el-table
                    ref="tableRef"
                    :data="filterTableData"
                    style="width: 100%; max-height: 100%;"
                    @selection-change="handleSelectionChange"
                    highlight-current-row
                >
                    <el-table-column fixed type="selection" width="40" />
                    <el-table-column v-if="columns.includes('dateIn')" label="DATE IN" property="dateIn" width="120" sortable/>
                    <el-table-column v-if="columns.includes('product')" property="product" label="PRODUCT" width="120" show-overflow-tooltip :filters="[
                      { text: 'IPhone', value: 'IPhone' },
                      { text: 'Samsung', value: 'Samsung' },]"
                      :filter-method="filterProductTag"
                      filter-placement="bottom-end">
                        <template #default="scope">
                          <div>{{ scope.row.product }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="columns.includes('supplier')" property="supplier" label="SUPPLIER" width="120" show-overflow-tooltip />
                    <el-table-column v-if="columns.includes('grade')" property="grade" width="100" label="GRADE" show-overflow-tooltip :filters="[
                      { text: 'Used', value: 'Used' },
                      { text: 'New', value: 'New' },]"
                      :filter-method="filterGradeTag"
                      filter-placement="bottom-end">
                        <template #default="scope">
                            <el-tag
                            :type="scope.row.grade === 'Used' ? '' : 'success'"
                            disable-transitions
                            >{{ scope.row.grade }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="columns.includes('storage')" property="storage" width="100" label="STORAGE" show-overflow-tooltip />
                    <el-table-column v-if="columns.includes('imei')" property="imei" label="IMEI" width="140">
                        <template #default="scope">
                          <p :class="{ 'border border-red-400 text-red-400 bg-red-100': imeiStatus[scope.row.imei] }" 
                            class="border shadow-md rounded-md px-2"
                          >
                            {{ scope.row.imei }}
                          </p>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="columns.includes('colour')" property="colour" label="COLOUR" show-overflow-tooltip />
                    <el-table-column v-if="columns.includes('amount')" property="amount" label="AMOUNT" show-overflow-tooltip sortable width="120"/>
                    <el-table-column v-if="columns.includes('cost')" property="cost" label="COST" show-overflow-tooltip sortable width="120"/>
                    <el-table-column v-if="columns.includes('margin')" property="margin" label="MARGIN" show-overflow-tooltip sortable width="120"/>
                    <el-table-column v-if="columns.includes('swap')" property="swap" label="SWAP" show-overflow-tooltip :filters="[
                        { text: 'no', value: 'no' },
                        { text: 'yes', value: 'yes' },]"
                    :filter-method="filterSwapTag"
                    filter-placement="bottom-end">
                        <template #default="scope">
                            <el-tag
                            :type="scope.row.swap === 'yes' ? '' : 'success'"
                            disable-transitions
                            >{{ scope.row.swap }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="columns.includes('dateOut')" property="dateOut" label="DATE OUT" show-overflow-tooltip sortable width="120"/>
                    <el-table-column v-if="columns.includes('createdBy')" property="createdBy" label="CREATED BY" show-overflow-tooltip />
                    <el-table-column v-if="columns.includes('createdAt')" property="createdAt" label="CREATED AT" show-overflow-tooltip />
                    <el-table-column v-if="columns.includes('updatedBy')" property="updatedBy" label="UPDATED BY" show-overflow-tooltip />
                    <el-table-column v-if="columns.includes('updatedAt')" property="updatedAt" label="UPDATED AT" show-overflow-tooltip />
                    <el-table-column fixed="right" width="48" align="center">
                        <template #default="scope">
                          <Icon @click="handleEdit(scope.$index, scope.row)" class="text-sky-600 cursor-pointer" name="heroicons:pencil"  size="20" />
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="48" align="center">
                        <template #default="scope">
                          <Icon @click="handleDuplicate(scope.$index, scope.row)" class="text-sky-600 cursor-pointer" name="solar:copy-bold"  size="20" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="fixed bottom-3 mt-[1em] right-[1em] sm:right-[5em] lg:right-[5em] bg-gray-50 z-10 px-[1rem] rounded-xl">
              <vue-awesome-paginate
                v-model="currentPage"
                :total-items="inventories.length"
                :items-per-page="10"
                :max-pages-shown="5"
              />
            </div>
          </el-tab-pane>

          <el-tab-pane label="Inventory Store" name="second">
            <div class="most-demanded-products mb-4">
             <MostSold />
            </div>
            <el-tabs v-model="nestedActiveName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="Unsold" name="nestedFirst">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-1">
                  <div v-for="(count, productName) in unsoldGroupedInventories" :key="productName" class="border border-sky-200 bg-sky-50 rounded-xl p-2 mb-2 flex justify-between items-center">
                    <h3 class="text-sm font-semibold">{{ productName }} </h3>
                    <div class="flex items-center">
                      <p class="mr-2">Qty:</p>
                      <p class="bg-sky-600 w-[4rem] text-white text-2xl font-black rounded-md text-center">{{ count.length }}</p>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="Sold" name="nestedSecond">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-1">
                <div v-for="(count, productName) in soldGroupedInventories" :key="productName" class="border border-sky-200 bg-sky-50 rounded-xl p-2 mb-2 flex justify-between items-center">
                  <h3 class="text-sm font-semibold">{{ productName }} </h3>
                  <div class="flex items-center">
                    <p class="mr-2">Qty:</p>
                    <p class="bg-sky-600 w-[4rem] text-white text-2xl font-black rounded-md text-center">{{ count.length }}</p>
                  </div>
                </div>
              </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>
    <el-drawer v-model="showDrawer" title="I am the title" :with-header="false" :size="largerThanXl? '40%' :largerThanlg? '50%':largerThanSm? '70%': '100%'" @closed="closeDrawer">
      <InventoryAddDrawer v-if="showAddDrawer" @close-drawer="closeDrawer"/>
      <InventoryEditDrawer v-if="showEditDrawer" @close-drawer="closeDrawer" :entry="selectedEntry"/>
      <InventoryDuplicateDrawer v-if="showDuplicateDrawer" @close-drawer="closeDrawer" :entry="selectedEntry"/>
    </el-drawer>
</template>
  
<script setup lang="ts">
import { useInventoryStore } from "~/store/inventory";
import { useStore } from "../store/receipts"
import { useAuthStore } from "~/store/users";
import { Search } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'


definePageMeta({
  layout:'dashboard'
})

const activeName = ref('first')
const nestedActiveName = ref('nestedFirst')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const imeiStatus = reactive({});

const checkImeiStatus = async () => {
  const receipts = store.receipts;
  inventories.value.forEach(async (inventory) => {
    const isSold = receipts.some(receipt => receipt.imei === inventory.imei);
    imeiStatus[inventory.imei] = isSold;

    if (inventory.sold !== isSold) {
      await inventoryStore.updateInventorySoldStatus(inventory.imei, isSold);
    }
  });
  localStorage.setItem('imeiStatus', JSON.stringify(imeiStatus));
};

const unsoldGroupedInventories = computed(() => {
  return inventories.value.reduce((acc, inventory) => {
    const productName = inventory.product;
    if (!acc[productName]) {
      acc[productName] = [];
    }
    if(inventory.sold == false) {
      acc[productName].push(inventory);
    }
    return acc;
  }, {});
});

const soldGroupedInventories = computed(() => {
  return inventories.value.reduce((acc, inventory) => {
    const productName = inventory.product;
    if (!acc[productName]) {
      acc[productName] = [];
    }
    if(inventory.sold == true) {
      
      acc[productName].push(inventory);
    }
    return acc;
  }, {});
});

const currentPage = ref(1)
const inventoryStore = useInventoryStore();
const { inventories } = toRefs(inventoryStore)
  
const showDropDown = ref(false)
const store = useStore()
const authStore = useAuthStore()
const invStore = useInventoryStore()
const isSigningout = ref(false)

const tableRef = ref();

const columns = ref(['dateIn', 'product', 'supplier', 'grade', 'storage', 'imei', 'colour', 'amount', 'cost', 'margin', 'swap', 'date Out']);

//drawer function
const showDrawer = ref(false)
const showAddDrawer = ref(false)
const showEditDrawer = ref(false)
const showDuplicateDrawer = ref(false)

function openAddDrawer(){
    showDrawer.value = true;
    showAddDrawer.value = true;
    showEditDrawer.value = false;
    showDuplicateDrawer.value = false;
}

function openEditDrawer(){
    showDrawer.value = true;
    showAddDrawer.value = false;
    showEditDrawer.value = true;
    showDuplicateDrawer.value = false;
}

function openDuplicateDrawer(){
    showDrawer.value = true;
    showAddDrawer.value = false;
    showEditDrawer.value = false;
    showDuplicateDrawer.value = true;
}

function closeDrawer(){
    showDrawer.value = false;
    showAddDrawer.value = false;
    showDuplicateDrawer.value = false;
}

//edit functions
const selectedEntry = ref();
const handleEdit = (index, row) => {
  selectedEntry.value = row
  openEditDrawer()
}

const handleDuplicate = (index, row) => {
  selectedEntry.value = row
  openDuplicateDrawer()
}

//select functions
const selected = ref([]);

const handleSelectionChange = (val) => {
  selected.value = val
}

function clearSelection(){
    tableRef.value.clearSelection()
    selected=[]
}

//filter functions
const dateRange = ref([])
const searchValue = ref('')

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

function filterByDate(data){
    const startDate = dateRange.value.length > 1? new Date(dateRange.value[0]): '';
    const endDate = dateRange.value.length > 1? new Date(dateRange.value[1]): '';
    const currentDate = new Date(data.dateIn);

    return currentDate >= startDate && currentDate <= endDate
}

const filterTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * 10;
  const endIndex = startIndex + 10;
  return inventories.value
    .filter((data) => {
      if (searchValue.value && dateRange.value.length > 1){
          return data.imei.includes(searchValue.value) && filterByDate(data)
      }
      else if (searchValue.value && (!dateRange.value || dateRange.value?.length < 2)){
          return data.imei.includes(searchValue.value)
      }
      else if (dateRange.value?.length > 1 && !searchValue.value){
          return filterByDate(data)
      }
      else return data
    })
    .slice(startIndex, endIndex)
})

const filterGradeTag = (value, row) => {
  return row.grade === value
}
const filterProductTag = (value, row) => {
  return row.product === value
}
const filterSwapTag = (value, row) => {
  return row.swap === value
}

onMounted(() => {
  store.fetchReceipts()
  invStore.fetchInventories()
  authStore.loadCurrentUserFromStorage()
  authStore.authenticated()

  const savedImeiStatus = localStorage.getItem('imeiStatus');
  if (savedImeiStatus) {
    Object.assign(imeiStatus, JSON.parse(savedImeiStatus));
  }

  checkImeiStatus();
})
</script>

<style scoped>
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
  @apply bg-sky-600;
  color: white;
  border: none;
  border-radius: 0.5em;
  transition: background-color 300ms;
}

::v-deep(.active-page){
  @apply bg-sky-600;
  color: white;
  height: 3.3em;
  width: 3.3em;
  border-radius: 0.5em;
}

::v-deep(.el-input__wrapper) {
  @apply rounded-xl 
}

.date-picker-input{
    ::v-deep(.el-date-range-picker.has-sidebar){
        width:200px;
        font-weight: 200;
        border:2px solid red;
        background-color: red;
    }
}

.el-date-range-picker .el-picker-panel__body{
    min-width:200px
}

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
</style>