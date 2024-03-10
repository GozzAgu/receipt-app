<template>
    <SignoutLoader v-if="isSigningout" />
    <Navbar @signing-out="isSigningout=true" class="z-10" />
    <div class="mt-24 w-[80%] mx-auto">
        <div class="flex justify-between mb-8">
            <div class="flex gap-4">
                <el-input
                v-model="searchValue"
                size="large"
                placeholder="Search for an item..."
                :prefix-icon="Search"
                class="max-w-[20rem] shadow-sm"
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
                    class="shadow-sm"
                />
            </div>
            
            <el-button type="primary" size="large" class="shadow-sm" @click="openAddDrawer">
                <Icon name="heroicons:plus-solid" size="1.2em" class="mr-2" />
                Add Entry
            </el-button>
        </div>
        <div class="flex justify-between items-center font-light py-2 text-gray-500 text-sm px-3">
            <div class="flex gap-6 items-center">
                <p>{{ selected.length }} entries selected</p>
                <div class="flex gap-2" v-if="selected.length > 0">
                    <button @click="clearSelection" class="flex items-center justify-center gap-1 rounded px-2 py-1 hover:bg-gray-400/10">Clear selection</button>
                    <button v-if="selected.length == 1" class="flex items-center justify-center gap-1 text-purple-500 rounded px-2 py-1  hover:bg-purple-500/10"><Icon name="heroicons:eye" size="1em"/>View</button>
                    <button class="flex items-center justify-center gap-1 text-red-400 rounded px-2 py-1 hover:bg-red-400/10"><Icon name="heroicons:trash-16-solid" size="1em" />Delete</button>
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
            >
                <el-table-column fixed type="selection" width="30" />
                <el-table-column fixed width="60" align="center">
                    <template #default="scope">
                        <button class="text-sky-600 cursor-pointer px-2 py-1 rounded hover:bg-sky-600/10" @click="handleEdit(scope.$index, scope.row)">
                            <Icon name="heroicons:pencil"  size="1.2em" />
                        </button>     
                    </template>
                </el-table-column>
                <el-table-column v-if="columns.includes('Date In')" label="Date In" property="dateIn" width="120" sortable/>
                <el-table-column v-if="columns.includes('Supplier')" property="supplier" label="Supplier" width="120" />
                <el-table-column v-if="columns.includes('Grade')" property="grade" label="Grade" show-overflow-tooltip :filters="[
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
                <el-table-column v-if="columns.includes('Storage')" property="storage" label="Storage" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('IMEI')" property="imei" label="IMEI" width="120"/>
                <el-table-column v-if="columns.includes('Colour')" property="colour" label="Colour" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('Amount')" property="amount" label="Amount" show-overflow-tooltip sortable width="100"/>
                <el-table-column v-if="columns.includes('Cost')" property="cost" label="Cost" show-overflow-tooltip sortable width="100"/>
                <el-table-column v-if="columns.includes('Margin')" property="margin" label="Margin" show-overflow-tooltip sortable width="100"/>
                <el-table-column v-if="columns.includes('Swap')" property="swap" label="Swap" show-overflow-tooltip :filters="[
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
                <el-table-column v-if="columns.includes('Date Out')" property="dateOut" label="dateOut" show-overflow-tooltip sortable width="120"/>
                <el-table-column v-if="columns.includes('Created By')" property="createdBy" label="Created By" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('Created At')" property="createdAt" label="Created At" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('Updated By')" property="updatedBy" label="Updated By" show-overflow-tooltip />
                <el-table-column v-if="columns.includes('Updated At')" property="updatedAt" label="Updated At" show-overflow-tooltip />
            </el-table>
        </div>
    </div>
    <el-drawer v-model="showDrawer" title="I am the title" :with-header="false" size="40%" @closed="closeDrawer">
      <InventoryAddDrawer v-if="showAddDrawer" @close-drawer="closeDrawer"/>
    </el-drawer>
</template>
  
<script setup>
import { useStore } from "../store/receipts"
import { Search } from '@element-plus/icons-vue'
  
const showDropDown = ref(false)

const store = useStore()
const isSigningout = ref(false)

const tableRef = ref();

const columns = ref(['Date In', 'Supplier', 'Grade', 'Storage', 'IMEI', 'Colour', 'Amount', 'Cost', 'Margin', 'Swap', 'Date Out']);

const tableData = ref([
    {
        dateIn: '1/13/2024',
        supplier: 'Hassan Mohuied',
        grade: 'Used',
        storage: '8GB/512GB',
        imei: '5CG71657NK',
        colour:'Silver',
        amount: 50000,
        cost: 250,
        margin: 50000,
        swap: 'no',
        dateOut:'2/22/2024'
    },
    {
        dateIn: '2/12/2024',
        supplier: 'Hassan Mohuied',
        grade: 'New',
        storage: '8GB/512GB',
        imei: '7CG716357QK',
        colour:'Silver',
        amount: 20000,
        cost: 250,
        margin: 50000,
        swap: 'no',
        dateOut:'2/22/2024'
    },
    {
        dateIn: '3/10/2024',
        supplier: 'Hassan Mohuied',
        grade: 'New',
        storage: '8GB/512GB',
        imei: '3CE62657BK',
        colour:'Silver',
        amount: 50500,
        cost: 250,
        margin: 50000,
        swap: 'yes',
        dateOut:'2/22/2024'
    },
    {
        dateIn: '2/12/2024',
        supplier: 'Hassan Mohuied',
        grade: 'Used',
        storage: '8GB/512GB',
        imei: '5AD71657PD',
        colour:'Silver',
        amount: 52000,
        cost: 250,
        margin: 50000,
        swap: 'no',
        dateOut:'2/22/2024'
    }
])

const handleEdit = (index, row) => {
  console.log(index, row)
}
//drawer function
const showDrawer = ref(false);
const showAddDrawer = ref(false)

function openAddDrawer(){
    showDrawer.value = true;
    showAddDrawer.value = true
}

function closeDrawer(){
    showDrawer.value = false;
    showAddDrawer.value = false;
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
  tableData.value.filter(
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
})
</script>

<style scoped>
</style>