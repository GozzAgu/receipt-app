<template>
  <div class="px-[1em] mt-[2em]">
    <p class="text-gray-50 bg-sky-700 p-[0.5em] rounded-lg mb-[1.5em] text-sm">
      Provide your Transaction details and company Info below to generate a virtual Receipt.
    </p>
    
    <div class="bg-slate-100 px-[1em] py-[1.5em] rounded-lg grid grid-cols-1 gap-y-[1em]">
      <p class="text-base font-medium">Receipt Form</p>
      <label class="block text-xs text-gray-700">Customer's Name</label>
      <input 
        v-model="companyDetails.customerName"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Customer's Address</label>
      <input 
        v-model="companyDetails.customerAddress"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Customer's Number</label>
      <input 
        v-model="companyDetails.customerNumber"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Company Name</label>
      <input 
        v-model="companyDetails.name"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Company Address</label>
      <input 
        v-model="companyDetails.address"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Product Name</label>
      <input 
        v-model="companyDetails.productName"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Product Description</label>
      <input 
        v-model="companyDetails.productDescription"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Product Quantity</label>
      <input 
        v-model="companyDetails.productQuantity"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />

      <label class="block text-xs text-gray-700">Product Price</label>
      <input 
        v-model="companyDetails.productPrice"
        class="
          focus:border-sky-500 
          focus:outline-none 
          border
          px-[1em] 
          py-[0.2em] 
          w-full" 
        placeholder="" 
      />
      <button 
        @click="addR" 
        class="
          rounded-lg
          mt-[1em] 
          bg-sky-700 
          text-gray-50 
          p-[0.5em] 
          hover:bg-sky-900"
      >
        Generate
      </button>
    </div>
  </div>
</template>

<script setup>
import store from '../details.json'
import { collection, getDocs, addDoc, doc } from "firebase/firestore";

const db = inject('firestore')
const details = store
const isValid = ref(false)
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

const fetchR = async() => {
  const querySnapshot = await getDocs(collection(db, "receipts"))
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

onMounted(() => {
  fetchR()
})

const validateForm = () => {
  for (const i in companyDetails.value) {
    if (!companyDetails.value[i]) {
      return false;
    }
  }
  return true;
};

const addR = async() => {
  if (!validateForm()) {
    alert('Please fill in all fields');
    return;
  }
  const docRef = await addDoc(collection(db, "receipts"), {
    customer: companyDetails.value
  });
  details.push(docRef)
}
</script>