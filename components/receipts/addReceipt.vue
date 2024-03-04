<template>
  <div class="px-[1em] md:px-[5em] lg:px-[15em] py-[5em] bg-blue-50">
    <NuxtLink to="/receiptTable">
      <el-button class="mb-[1em]" type="primary">
        <el-icon><Back /></el-icon>
        <span class="ml-[1em] text-[0.7em] md:text-base">Back</span>
      </el-button>
    </NuxtLink>
    
    <p class="text-gray-50 bg-blue-400 p-[1em] rounded-t-lg text-sm">
      Provide your Transaction details and company Info below to generate a virtual Receipt.
    </p>

    <div v-loading="loading" class=" bg-white px-[1.5em] py-[2.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-blue-400">Receipt Form</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="companyDetails"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-3 gap-[1em]">

          <el-form-item label="Customer name" prop="customerName">
            <el-input v-model="companyDetails.customerName" placeholder="" />
          </el-form-item>
          <el-form-item label="Customer address" prop="customerAddress">
            <el-input v-model="companyDetails.customerAddress" placeholder="" />
          </el-form-item>
          <el-form-item label="Customer number" prop="customerNumber">
            <el-input v-model="companyDetails.customerNumber" placeholder="" />
          </el-form-item>
          <el-form-item label="Company name" prop="name">
            <el-input v-model="companyDetails.name" placeholder="" />
          </el-form-item>
          <el-form-item label="Company address" prop="address">
            <el-input v-model="companyDetails.address" placeholder="" />
          </el-form-item>
          <el-form-item label="Product name" prop="productName">
            <el-input v-model="companyDetails.productName" placeholder="" />
          </el-form-item>
          <el-form-item label="Product description" prop="productDescription">
            <el-input v-model="companyDetails.productDescription" placeholder="" type="textarea"/>
          </el-form-item>
          <el-form-item label="Payment Mode">
            <el-select v-model="companyDetails.paidVia" placeholder="select" style="width: 240px">
              <el-option v-for="item in paymentMethods" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> 
        </div>
        <div class="flex gap-x-[1em]">
          <el-form-item label="Product quantity" prop="productQuantity">
            <el-input v-model="companyDetails.productQuantity" placeholder="" />
          </el-form-item>
          <el-form-item label="Product price" prop="productPrice">
            <el-input v-model="companyDetails.productPrice" placeholder="" />
          </el-form-item>
        </div>
      </el-form>

      <el-button class="mt-[2em]" type="primary" @click="addR(ruleFormRef)">
        <el-icon><Tickets /></el-icon>
        <span class="ml-[1em] text-[0.7em] md:text-base">Generate Receipt</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { RuleForm } from '@/types/types'
import { Tickets, Back } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

let companyDetails = reactive<RuleForm>({
  id: '',
  customerName: '',
  customerAddress: '',
  customerNumber: '',
  name: '',
  address: '',
  productName: '',
  productDescription: '',
  productQuantity: 0,
  productPrice: 0,
  newPrice: 0,
  date: '',
  receiptOf: '',
  imei: '',
  paidVia: ''
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

const rules = reactive<FormRules<RuleForm>>({
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
  paidVia: [
    { required: true, message: 'Please select a payment method', trigger: 'blur' },
  ]
})

onMounted(() => {
  store.fetchReceipts()
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
        let newCompanyDetails = { ...companyDetails, date: currentDate.value }
        if (newCompanyDetails.productQuantity > 1) {
          let newPrice = newCompanyDetails.productQuantity * newCompanyDetails.productPrice
          newCompanyDetails.newPrice = newPrice
        }
        const res = await store.addReceipt(newCompanyDetails)        
        router.push({path:`/receipt/${res}`})
        companyDetails = {} as RuleForm
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

<style scoped>

</style>