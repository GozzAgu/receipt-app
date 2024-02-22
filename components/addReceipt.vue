<template>
  <div class="px-[1em] pt-[6em] ">
    <p class="text-gray-50 bg-sky-700 p-[0.5em] rounded-t-lg text-sm">
      Provide your Transaction details and company Info below to generate a virtual Receipt.
    </p>

    <div class=" px-[1em] py-[1.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <p class="text-base font-medium">Receipt Form</p>

      <el-form
        ref="ruleFormRef"
        :model="companyDetails"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
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
          <el-input v-model="companyDetails.productDescription" placeholder="" />
        </el-form-item>
        <div class="flex gap-x-[1em]">
          <el-form-item label="Product quantity" prop="productQuantity">
            <el-input v-model="companyDetails.productQuantity" placeholder="" />
          </el-form-item>
          <el-form-item label="Product price" prop="productPrice">
            <el-input v-model="companyDetails.productPrice" placeholder="" />
          </el-form-item>
        </div>
      </el-form>

      <el-button class="mt-[2em]" type="primary" @click="addR(ruleFormRef)"> Generate Receipt </el-button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "~/store"
import { collection, getDocs, addDoc, doc } from "firebase/firestore"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { RuleForm } from '../types'

const store = useStore()
const router = useRouter()
// const db = inject('firestore')
const nuxtApp = useNuxtApp()
const labelPosition = ref<FormProps['labelPosition']>('top')

const ruleFormRef = ref<FormInstance>()

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
  productPrice: 0
})

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

const fetchR = async() => {
  const querySnapshot = await getDocs(collection(nuxtApp.$firestore, "receipts"))
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data())
  });
}

onMounted(() => {
  fetchR()
})

const addR = async(formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      try{
        if(companyDetails.productQuantity > 1) {
          
          const newPrice = companyDetails.productQuantity * companyDetails.productPrice
          companyDetails.productPrice = newPrice
        }
        const docRef = await addDoc(collection(nuxtApp.$firestore, "receipts"), {
          customer: companyDetails,
        });
        companyDetails.id = docRef.id
        
        store.receipts.push(companyDetails as never)
        router.push({path: '/receipt', params: {id: companyDetails.id} })
        companyDetails = {} as RuleForm;
      } catch(e) {
        console.log(e)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped>

</style>