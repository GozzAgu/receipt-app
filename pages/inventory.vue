<template>
    <SignoutLoader v-if="isSigningout" />
    <div class="mt-24 px-[1em] md:px-[5em] lg:px-[5em] mx-auto">
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
              
              <NuxtLink 
                class="
                  bg-sky-600 hover:bg-sky-500 transition duration-500 
                  hover:shadow-lg rounded-lg flex justify-center 
                  items-center w-[10rem] text-white cursor-pointer py-[0.3em]"
              > 
                <Icon name="heroicons:plus-solid" :size="20" class="mr-2" />
                Import Excel
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
        <div class="border-t border-gray-100">
            <el-table
                ref="tableRef"
                :data="filterTableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                highlight-current-row
                :border="parentBorder"
            >
                <el-table-column fixed type="selection" width="40" />
                <el-table-column fixed width="60" align="center">
                    <template #default="scope">
                        <button class=" cursor-pointer px-2 py-1 rounded hover:bg-sky-600/10" @click="handleEdit(scope.$index, scope.row)">
                            <Icon class="text-sky-600" name="heroicons:pencil"  size="1.2em" />
                        </button>     
                    </template>
                </el-table-column>
                <el-table-column v-if="columns.includes('dateIn')" label="Date In" property="dateIn" width="120" sortable/>
                <el-table-column v-if="columns.includes('supplier')" property="supplier" label="Supplier" width="120" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('grade')" property="grade" width="100" label="Grade" show-overflow-tooltip :filters="[
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
                <el-table-column v-if="columns.includes('storage')" property="storage" width="100" label="Storage" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('imei')" property="imei" label="IMEI" width="140">
                    <template #default="scope">
                      <p :class="{ 'bg-red-400': isImeiInReceipts(scope.row.imei) }" 
                        class="bg-gray-200 text-sky-600 rounded-md px-2"
                      >
                        {{ scope.row.imei }}
                      </p>
                    </template>
                </el-table-column>
                <el-table-column v-if="columns.includes('colour')" property="colour" label="Colour" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('amount')" property="amount" label="Amount" show-overflow-tooltip sortable width="120"/>
                <el-table-column v-if="columns.includes('cost')" property="cost" label="Cost" show-overflow-tooltip sortable width="120"/>
                <el-table-column v-if="columns.includes('margin')" property="margin" label="Margin" show-overflow-tooltip sortable width="120"/>
                <el-table-column v-if="columns.includes('swap')" property="swap" label="Swap" show-overflow-tooltip :filters="[
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
                <el-table-column v-if="columns.includes('dateOut')" property="dateOut" label="dateOut" show-overflow-tooltip sortable width="120"/>
                <el-table-column v-if="columns.includes('createdBy')" property="createdBy" label="Created By" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('createdAt')" property="createdAt" label="Created At" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('updatedBy')" property="updatedBy" label="Updated By" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('updatedAt')" property="updatedAt" label="Updated At" show-overflow-tooltip />
            </el-table>
        </div>
    </div>
    <el-drawer v-model="showDrawer" title="I am the title" :with-header="false" :size="largerThanXl? '40%' :largerThanlg? '50%':largerThanSm? '70%': '100%'" @closed="closeDrawer">
      <InventoryAddDrawer v-if="showAddDrawer" @close-drawer="closeDrawer"/>
      <InventoryEditDrawer v-if="showEditDrawer" @close-drawer="closeDrawer" :entry="selectedEntry"/>
    </el-drawer>
</template>
  
<script setup>
import { useInventoryStore } from "~/store/inventory";
import { useStore } from "../store/receipts"
import { Search } from '@element-plus/icons-vue'

definePageMeta({
  layout:'dashboard'
})

const isImeiInReceipts = (imei) => {
  return store.receipts.find(receipt => receipt.imei === imei);
}

const inventoryStore = useInventoryStore();
const { inventories } = toRefs(inventoryStore)
  
const showDropDown = ref(false)
const parentBorder = ref(true)
const store = useStore()
const invStore = useInventoryStore()
const isSigningout = ref(false)

const tableRef = ref();

const columns = ref(['dateIn', 'supplier', 'grade', 'storage', 'imei', 'colour', 'amount', 'cost', 'margin', 'swap', 'date Out']);

//drawer function
const showDrawer = ref(false);
const showAddDrawer = ref(false)
const showEditDrawer = ref(false)

function openAddDrawer(){
    showDrawer.value = true;
    showAddDrawer.value = true;
    showEditDrawer.value = false;
}

function openEditDrawer(){
    showDrawer.value = true;
    showAddDrawer.value = false;
    showEditDrawer.value = true;
}

function closeDrawer(){
    showDrawer.value = false;
    showAddDrawer.value = false;
}

//edit functions
const selectedEntry = ref();
const handleEdit = (index, row) => {
  selectedEntry.value = row
  openEditDrawer()
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

const filterTableData = computed(() =>
  inventories.value.filter(
    (data) =>
    {
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

      // return (
      //     // (!searchValue.value || data.imei.includes(searchValue.value)) ||
      //     (( !dateRange.value || dateRange.value.length === 0) || filterByDate(data))
          
      // );
    }
    //   !searchValue.value ||
    //   data.imei.includes(searchValue.value)
  )
)

const filterGradeTag = (value, row) => {
  return row.grade === value
}
const filterSwapTag = (value, row) => {
  return row.swap === value
}

onMounted(() => {
store.fetchReceipts();
invStore.fetchInventories();
})
</script>

<style scoped>
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