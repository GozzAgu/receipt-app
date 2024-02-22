<template>
  <div class="px-[1em] pt-[6em] ">
    <p class="text-gray-50 bg-sky-700 p-[0.5em] rounded-t-lg text-sm">
      Provide your Transaction details and company Info below to generate a virtual Receipt.
    </p>

    <div class=" px-[1em] py-[1.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <p class="text-base font-medium">Receipt Form</p>

      <div>
        <label class="block text-xs text-gray-700 mb-[0.5em]">
          Customer's Name 
          <span class="text-red-500">*</span>
        </label>
        <el-input v-model="companyDetails.customerName" placeholder="" />
      </div>

      <div>
        <label class="block text-xs text-gray-700 mb-[0.5em]">
          Customer's Address
          <span class="text-red-500">*</span>
        </label>
        <el-input v-model="companyDetails.customerAddress" placeholder="" />
      </div>

      <div>
        <label class="block text-xs text-gray-700 mb-[0.5em]">
          Customer's Number
          <span class="text-red-500">*</span>
        </label>
        <el-input v-model="companyDetails.customerNumber" placeholder="" />
      </div>

      <div>
        <label class="block text-xs text-gray-700 mb-[0.5em]">
          Company Name
          <span class="text-red-500">*</span>
        </label>
        <el-input v-model="companyDetails.name" placeholder="" />
      </div>

      <div>
        <label class="block text-xs text-gray-700 mb-[0.5em]">
          Company Address
          <span class="text-red-500">*</span>
        </label>
        <el-input v-model="companyDetails.address" placeholder="" />
      </div>

      <div>
        <label class="block text-xs text-gray-700 mb-[0.5em]">
          Product Name
          <span class="text-red-500">*</span>
        </label>
        <el-input v-model="companyDetails.productName" placeholder="" />
      </div>

      <div>
        <label class="block text-xs text-gray-700 mb-[0.5em]">
          Product Description
          <span class="text-red-500">*</span>
        </label>
        <el-input v-model="companyDetails.productDescription" placeholder="" />
      </div>

      <div class="flex gap-x-[1em]">
        <div>
          <label class="block text-xs text-gray-700 mb-[0.5em]">
            Product Quantity
            <span class="text-red-500">*</span>
          </label>
          <el-input v-model="companyDetails.productQuantity" placeholder="" />
        </div>
  
        <div>
          <label class="block text-xs text-gray-700 mb-[0.5em]">
            Product Price
            <span class="text-red-500">*</span>
          </label>
          <el-input v-model="companyDetails.productPrice" placeholder="" />
        </div>
      </div>

      <el-button class="mt-[2em]" type="primary" @click="addR"> Generate Receipt </el-button>

    </div>
  </div>
</template>

<script setup>
import store from '../details.json'
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { ElNotification } from 'element-plus'

const router = useRouter()
const db = inject('firestore')
const details = store
const isValid = ref(true)
const companyDetails = ref({
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

const openError = () => {
  ElNotification({
    title: 'Error',
    message: 'Some fields are empty',
    type: 'error',
  })
}

const fetchR = async() => {
  const querySnapshot = await getDocs(collection(db, "receipts"))
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data())
  });
}

onMounted(() => {
  fetchR()
})

const borderError = computed(() => {
  if(isValid.value == false) {
    return 'input-border'
  }else {
    return ''
  }
})

const validateForm = () => {
  for (const [key, value] of Object.entries(companyDetails.value)) {
    console.log(key, value)
    if(key == 'id') {
      continue;
    }
    if (value == '') {
      isValid.value = false
      openError()
      return false;
    }
  }
  isValid.value = true
  return true;
};

const addR = async() => {
  if (!validateForm()) {
    // alert('Please fill in all fields');
    return;
  }
  if(companyDetails.value.productQuantity > 1) {
    
    const newPrice = companyDetails.value.productQuantity * companyDetails.value.productPrice
    companyDetails.value.productPrice = newPrice
  }
  const docRef = await addDoc(collection(db, "receipts"), {
    customer: companyDetails.value,
  });
  companyDetails.value.id = docRef.id
  
  details.push({...companyDetails.value, id: docRef.id})
  router.push('/receipt', { params: {id: companyDetails.value.id} })
  companyDetails.value = ''
}
</script>

<style scoped>
.input-border {
  border-color: red;
}
</style>