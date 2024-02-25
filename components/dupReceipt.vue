<template>
  <div class="px-[1em] py-[5em] bg-blue-50">
    <NuxtLink to="/">
      <el-button class="mb-[1em]" type="primary">
        <el-icon><Back /></el-icon>
        <span class="ml-[1em] text-[0.7em]">Back home</span>
      </el-button>
    </NuxtLink>
    
    <p class="text-gray-50 bg-blue-400 p-[1em] rounded-t-lg text-sm">
      Provide your Transaction details and company Info below to generate a virtual Receipt.
    </p>

    <div v-loading="loading" class=" bg-white px-[1.5em] py-[2.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-blue-400">Receipt Form</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="duplicate"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <el-form-item label="Customer name" prop="customerName">
          <el-input v-model="duplicate.customerName" placeholder="" />
        </el-form-item>
        <el-form-item label="Customer address" prop="customerAddress">
          <el-input v-model="duplicate.customerAddress" placeholder="" />
        </el-form-item>
        <el-form-item label="Customer number" prop="customerNumber">
          <el-input v-model="duplicate.customerNumber" placeholder="" />
        </el-form-item>
        <el-form-item label="Company name" prop="name">
          <el-input disabled v-model="duplicate.name" placeholder="" />
        </el-form-item>
        <el-form-item label="Company address" prop="address">
          <el-input v-model="duplicate.address" placeholder="" />
        </el-form-item>
        <el-form-item label="Product name" prop="productName">
          <el-input v-model="duplicate.productName" placeholder="" />
        </el-form-item>
        <el-form-item label="Product description" prop="productDescription">
          <el-input v-model="duplicate.productDescription" placeholder="" type="textarea"/>
        </el-form-item>
        <div class="flex gap-x-[1em]">
          <el-form-item label="Product quantity" prop="productQuantity">
            <el-input v-model="duplicate.productQuantity" placeholder="" />
          </el-form-item>
          <el-form-item label="Product price" prop="productPrice">
            <el-input v-model="duplicate.productPrice" placeholder="" />
          </el-form-item>
        </div>
      </el-form>

      <el-button class="mt-[2em]" type="primary" @click="addR(ruleFormRef)">
        <el-icon><Tickets /></el-icon>
        <span class="ml-[1em] text-[0.7em]">Generate Receipt</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../store"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { RuleForm } from '../types'
import { Tickets, Back } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

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
})

onMounted(() => {
  store.fetchReceipts()
  console.log(duplicate)
})

const dups = computed(() => {
  return route.params.id
})

const duplicate = computed(() => {
  return store.receipts.find(dup => dup.id == dups.value) || {}
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
        let newCompanyDetails = { ...duplicate.value, date: currentDate.value }
        if (newCompanyDetails.productQuantity > 1) {
          let newPrice = newCompanyDetails.productQuantity * newCompanyDetails.productPrice
          newCompanyDetails.newPrice = newPrice
        }
        const res = await store.addReceipt(newCompanyDetails)        
        router.push({path:`/receipt/${res}`})
        newCompanyDetails = {} as RuleForm
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