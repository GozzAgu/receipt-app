<template>
  <div class="px-[1em] md:px-[5em] lg:px-[10em] py-[5em]">
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
        w-[3rem]" 
      to="/receiptTable"
    > 
      <Icon class="text-white ml-[0.5rem]" name="material-symbols:arrow-back-ios" size="25" />
    </NuxtLink> 
    
    <p class="text-gray-50 bg-sky-600 p-[1em] rounded-t-lg text-sm">
      Provide your Transaction details and company Info below to generate a virtual Receipt.
    </p>

    <div v-loading="loading" class="shadow-lg bg-white px-[1.5em] py-[2.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-sky-600">Receipt Form</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="duplicate"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">
          <el-form-item label="Customer name" prop="customerName">
            <el-input v-model="duplicate!.customerName" placeholder="" />
          </el-form-item>
          <el-form-item label="Customer address" prop="customerAddress">
            <el-input v-model="duplicate!.customerAddress" placeholder="" />
          </el-form-item>
          <el-form-item label="Customer number" prop="customerNumber">
            <el-input v-model="duplicate!.customerNumber" placeholder="" />
          </el-form-item>
          <el-form-item label="Company name" prop="name">
            <el-input disabled v-model="duplicate!.name" placeholder="" />
          </el-form-item>
          <el-form-item label="Company address" prop="address">
            <el-input disabled v-model="duplicate!.address" placeholder="" />
          </el-form-item>
          <el-form-item label="Product name" prop="productName">
            <el-input v-model="duplicate!.productName" placeholder="" />
          </el-form-item>
          <el-form-item label="Product description" prop="productDescription">
            <el-input v-model="duplicate!.productDescription" placeholder="" type="textarea"/>
          </el-form-item>
          <el-form-item label="Payment Mode">
            <el-select v-model="duplicate!.paidVia" placeholder="select">
              <el-option v-for="item in paymentMethods" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> 
          <el-form-item label="Swap deal?">
            <el-switch
              v-model="swap"
              class="mt-2"
              style="margin-left: 24px"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
            />
          </el-form-item>  
          <el-form-item v-if="swap == true" label="Swap from" prop="swapFrom">
            <el-input v-model="duplicate!.swapFrom" placeholder="" />
          </el-form-item> 
          <el-form-item v-if="swap == true" label="Swap to" prop="productName">
            <el-input disabled v-model="duplicate!.productName" placeholder="" />
          </el-form-item> 
        </div>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-x-[1em]">
          <el-form-item label="Product quantity" prop="productQuantity">
            <el-input v-model="duplicate!.productQuantity" placeholder="" />
          </el-form-item>
          <el-form-item label="Product price" prop="productPrice">
            <el-input v-model="duplicate!.productPrice" placeholder="" />
          </el-form-item>
        </div>
      </el-form>

      <NuxtLink 
        class="
          cursor-pointer
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
          w-[100%]" 
          @click="addR(ruleFormRef)"
      > 
        <span class="ml-[1em] text-[0.7em] md:text-base text-white">Generate Receipt</span>
      </NuxtLink> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { Receipt } from '@/types/types'
import { Tickets, Back, Check, Close } from '@element-plus/icons-vue'

const swap = ref(false)
const store = useStore()
const router = useRouter()
const route = useRoute()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

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
  name: [
    { required: true, message: 'Please input Company name', trigger: 'blur' },
  ],
  address: [
    { required: true, message: 'Please input Company address', trigger: 'blur' },
  ],
  productName: [
    { required: true, message: 'Please input Product name', trigger: 'blur' },
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
  swapFrom: [
    { required: true, message: 'Please input Product price', trigger: 'blur' },
  ],
})

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
  {
    value: 'Usdt',
    label: 'Usdt',
  },
]

onMounted(() => {
  store.fetchReceipts()
})

const dups = computed(() => {
  return route.params.id
})

const duplicate = computed(() => {
  return store.receipts.find(dup => dup.id == dups.value)
})

const currentDate = computed(() => {
  const date = new Date().toJSON().slice(0,10).replace(/-/g,'/')
  return date
})

const addR = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        let newCompanyDetails = { ...duplicate.value, date: currentDate.value } as Receipt
        if (newCompanyDetails.productQuantity > 1) {
          let newPrice = newCompanyDetails.productQuantity * newCompanyDetails.productPrice
          newCompanyDetails.newPrice = newPrice
        } else {
          newCompanyDetails.newPrice = newCompanyDetails.productPrice
        }
        const res = await store.addReceipt(newCompanyDetails)       
        router.push({path:`/receipt/${res}`})
        newCompanyDetails = {} as Receipt
        loading.value = false
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};
</script>