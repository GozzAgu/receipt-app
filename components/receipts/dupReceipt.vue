<template>
  <div class="px-[1em] sm:px-[5em] lg:px-[10em] py-[5em]">
    <NuxtLink 
      class="
        p-[0.5rem]
        my-[1rem]
        bg-sky-600 
        hover:bg-sky-500 
        transition 
        duration-500 
        hover:shadow-lg 
        rounded-lg 
        flex 
        justify-center 
        items-center 
        w-[2.5rem]" 
      to="/receiptTable"
    > 
      <Icon class="text-white" name="solar:arrow-left-line-duotone" size="20" />
    </NuxtLink> 
    
    <p class="text-gray-50 bg-sky-600 p-[1em] rounded-t-lg text-sm">
      Provide your Transaction details and company Info below to generate a virtual Receipt.
    </p>

    <div v-loading="loading" class="shadow-lg bg-white px-[1.5em] py-[2.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-sky-600">Receipt Form</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="dup"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">
          <el-form-item label="Customer name" prop="customerName">
            <el-input v-model="dup!.customerName" placeholder="" />
          </el-form-item>
          <el-form-item label="Customer address" prop="customerAddress">
            <el-input v-model="dup!.customerAddress" placeholder="" />
          </el-form-item>
          <el-form-item label="Customer number" prop="customerNumber">
            <el-input v-model="dup!.customerNumber" placeholder="" />
          </el-form-item>
          <el-form-item label="Product name" prop="productName">
            <el-input v-model="dup!.productName" placeholder="" />
          </el-form-item>
          <el-form-item label="Imei" prop="newimei">
            <el-input v-model="newImei" placeholder="" />
          </el-form-item>
          <el-form-item label="Product description" prop="productDescription">
            <el-input v-model="dup!.productDescription" placeholder="" type="textarea"/>
          </el-form-item>
          <el-form-item label="Payment Mode" prop="paidVia">
            <el-select v-model="dup!.paidVia" placeholder="select">
              <el-option v-for="item in paymentMethods" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> 
          <el-form-item label="Grade" prop="grade">
            <el-select v-model="dup!.grade" placeholder="select">
              <el-option v-for="item in grades" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> 
          <el-form-item label="Swap ?">
            <el-select v-model="dup!.swap" placeholder="select">
              <el-option v-for="item in swap" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>  
          <el-form-item v-if="dup!.swap == 'Yes'" label="Swap from" prop="swapFrom">
            <el-input v-model="dup!.swapFrom" placeholder="" />
          </el-form-item> 
          <el-form-item v-if="dup!.swap == 'Yes'" label="Swap to" prop="productName">
            <el-input disabled v-model="dup!.productName" placeholder="" />
          </el-form-item> 
        </div>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-x-[1em]">
          <el-form-item label="Product quantity" prop="productQuantity">
            <el-input v-model="dup!.productQuantity" placeholder="" />
          </el-form-item>
          <el-form-item label="Product price" prop="productPrice">
            <el-input v-model="dup!.productPrice" placeholder="" />
          </el-form-item>
        </div>
        <el-button class="w-full mt-[2rem]" @click="addR(ruleFormRef)"> 
          <span class="ml-[1em] text-[0.7em] md:text-base text-white">Generate Receipt</span>
        </el-button> 
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { useInventoryStore } from "@/store/inventory"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { Receipt } from '@/types/types'

const store = useStore()
const invStore = useInventoryStore()
const router = useRouter()
const route = useRoute()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const newImei = ref('')

const rules = reactive<FormRules<Receipt>>({
  customerName: [
    { required: true, message: 'Please input Customer name', trigger: 'blur' },
  ],
  customerAddress: [
    { required: true, message: 'Please input Customer address', trigger: 'blur' },
  ],
  customerNumber: [
    { required: true, message: 'Please input Customer number', trigger: 'blur' },
  ],
  productName: [
    { required: true, message: 'Please input Product name', trigger: 'blur' },
  ],
  imei: [
    { required: true, message: 'Please input Imei', trigger: 'blur' },
  ],
  productDescription: [
    { required: true, message: 'Please input Product description', trigger: 'blur' },
  ],
  productQuantity: [
    { required: true, message: 'Please input Product quantity', trigger: 'blur' },
  ],
  productPrice: [
    { required: true, message: 'Please input Product price', trigger: 'blur' },
  ],
  paidVia: [
    { required: true, message: 'Please select a payment method', trigger: 'blur' },
  ],
  swap: [
    { required: true, message: 'Please select', trigger: 'blur' },
  ],
  swapFrom: [
    { required: true, message: 'Please input Product', trigger: 'blur' },
  ],
  grade: [
    { required: true, message: 'Please select', trigger: 'blur' },
  ],
})

const swap = [
  {
    value: 'Yes',
    label: 'Yes',
  },
  {
    value: 'No',
    label: 'No',
  }
]

const grades = [
  {
    value: 'Used',
    label: 'Used',
  },
  {
    value: 'New',
    label: 'New',
  }
]

const paymentMethods = [
  {
    value: 'Cash',
    label: 'Cash',
  },
  {
    value: 'Pos',
    label: 'Pos',
  },
  {
    value: 'Transfer',
    label: 'Transfer',
  },
]

onMounted(() => {
  store.fetchReceipts()
  console.log('mounted')
})

const duplicates = computed(() => {
  return route.params.id
})

const dup = computed(() => {
  if (store.receipts.length == 0) {
    return {
      customerName: '',
      customerAddress: '',
      customerNumber: '',
      productName: '',
      productDescription: '',
      productQuantity: 0,
      productPrice: 0,
      newPrice: 0,
      date: '',
      receiptOf: '',
      imei: '',
      paidVia: '',
      swapFrom: '',
      swap: '',
      grade: ''
    }
  } else {
    return store.receipts.find(dup => dup.id == duplicates.value)
  }
})

const today = new Date()
const month = ref(today.getMonth() + 1)
const day = ref(today.getDate())
const year = ref(today.getFullYear())

const currentDate = computed<string>(()=> `${month.value}/${day.value}/${year.value}`)

const success = () => {
  ElMessage({
    message: 'Receipt created successfully',
    type: 'success',
  })
}

const addR = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      try {
        if (newImei.value) {
          const inventoryItem = invStore.searchInventoryByIMEI(newImei.value);
          if (!inventoryItem) {
            ElMessage({
              message: 'Inventory item with provided IMEI does not exist',
              type: 'error',
            });
            loading.value = false;
            return;
          }

          const isImeiInReceipts = store.receipts.some(receipt => receipt.imei === newImei.value)
          if (isImeiInReceipts) {
            ElMessage({
              message: 'This product has been sold',
              type: 'error',
            })
            loading.value = false;
            return
          }

          if (inventoryItem.product !== dup.value!.productName) {
            ElMessage({
              message: 'Product name in inventory does not match with the selected product',
              type: 'error',
            })
            loading.value = false
            return
          }

          let newCompanyDetails = { ...dup.value, date: currentDate.value, imei: newImei.value } as Receipt;
          if (newCompanyDetails.productQuantity > 1) {
            let newPrice = newCompanyDetails.productQuantity * newCompanyDetails.productPrice;
            newCompanyDetails.newPrice = newPrice;
          } else {
            newCompanyDetails.newPrice = newCompanyDetails.productPrice;
          }

          const res = await store.addReceipt(newCompanyDetails);       
          router.push({ path: `/receipt/${res}` });
          newCompanyDetails = {} as Receipt;
          loading.value = false;
          success();
        } 
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

</script>

<style scoped>
::v-deep(.el-button) {
  @apply bg-sky-600 text-white py-[1.5em] rounded-xl 
}

::v-deep(.el-button):hover {
  @apply bg-sky-500 text-white py-[1.5em] rounded-xl 
}

::v-deep(.el-input__wrapper) {
  @apply py-[0.5em] rounded-xl h-[3rem]
}

::v-deep(.el-textarea__inner) {
  @apply py-[0.5em] rounded-xl h-[3rem]
}

::v-deep(.el-select__wrapper) {
  @apply py-[0.5em] rounded-xl h-[3rem]
}
</style>