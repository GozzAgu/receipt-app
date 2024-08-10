<template>
  <div class="print:m-auto px-4 sm:px-20 py-12 min-h-screen mt-8">
    <div class="flex justify-between mt-[4em] mb-[2em]">
      <NuxtLink 
        class="
          p-[0.5rem]
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

      <el-button class="py-2 px-4" type="success" @click="exportToPDF('receipt.pdf', pdfSection)">
        <Icon name="line-md:download-loop" color="white" size="20" />
        <span class="ml-2 text-sm md:text-base">Download Receipt</span>
      </el-button>
    </div>
    <div ref="pdfSection" v-loading="loading" class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div class="px-8 py-6">
        <!-- Header Section -->
        <div class="flex gap-x-8 justify-between items-start mb-8 border-b pb-4">
          <div>
            <div class="flex gap-x-4">
              <img v-if="imageUrl" :src="imageUrl" class="w-4 h-4 md:w-8 md:h-8 mb-2" />
              <h2 class="font-bold text-xl">{{ authStore.currentUser?.adminName || authStore.managerAdmin?.adminName }}</h2>
            </div>
            <p class="text-sm">Address: {{ authStore.currentUser?.address || authStore.managerAdmin?.address }}.</p>
            <p class="text-sm">Email: {{ authStore.currentUser?.email || authStore.managerAdmin?.email }}.</p>
          </div>
          <div>
            <p class="text-xs">Date: {{ rpt?.date }}</p>
            <p class="text-xs">Receipt No: 0001692</p>
          </div>
        </div>

        <!-- Customer Details -->
        <div class="mb-6">
          <h3 class="font-semibold text-lg mb-2">Customer Details</h3>
          <div class="text-sm">
            <p class="font-semibold">{{ rpt?.customerName }}</p>
            <p>{{ rpt?.customerAddress }}</p>
            <p>{{ rpt?.customerNumber }}</p>
          </div>
        </div>

        <!-- Devices Purchased -->
        <div class="mb-6">
          <h3 class="font-semibold text-lg mb-2">Devices Purchased</h3>
          <div class="text-sm border-t border-b py-4">
            <div class="flex justify-between font-semibold">
              <span class="w-1/12">S/No</span>
              <span class="w-6/12">Product</span>
              <span class="w-3/12">Identifier</span>
              <span class="w-1/12">Qty</span>
              <span class="w-2/12">Subtotal</span>
            </div>
            <div class="flex justify-between mt-2">
              <span class="w-1/12">1</span>
              <span class="w-6/12">{{ rpt?.productDescription }}</span>
              <span class="w-3/12">{{ rpt?.imei }}</span>
              <span class="w-1/12">{{ rpt?.productQuantity }}</span>
              <span class="w-2/12">₦{{ rpt?.productPrice }}</span>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="mb-6 text-sm">
          <div class="flex justify-end">
            <div class="w-4/12">
              <div class="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₦{{ rpt?.productPrice }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Tax (0%):</span>
                <span>₦0.00</span>
              </div>
              <div class="flex justify-between font-bold border-t pt-2">
                <span>Grand Total:</span>
                <span>₦{{ rpt?.productPrice }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="px-6 py-4 bg-sky-600 text-white text-xs rounded-b-lg">
          <p class="font-semibold">TERMS AND CONDITIONS:</p>
          <p>1. Goods received in good order and conditions cannot be returned...</p>
          <!-- Include the rest of the terms and conditions here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useAuthStore } from '~/store/users'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'

let imageUrl = ref()
const nuxtApp = useNuxtApp()
const authStore = useAuthStore()
const pdfSection = ref<HTMLElement | null>(null)
const store = useStore()
const route = useRoute()
const loading = ref(false)

// const isShown = () => {
//   if(rpt.value) {
//     loading.value = false
//   }
// }

const fetchImage = async () => {
  try {
    if (authStore.currentUser) {
      const userId = authStore.currentUser?.id
      const storageReference = storageRef(nuxtApp.$storage, `images/${userId}`)
      const url = await getDownloadURL(storageReference)
      imageUrl.value = url
      console.log('Image URL:', url)  // Log the URL to ensure it's correct
    } else {
      console.error("Current user not available.")
    }
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}


const r = computed(() => {
  return route.params.id
})

const rpt = computed(() => {
  return store.receipts.find(re => re.id == r.value)
})

onMounted(async () => {
  await store.fetchReceipts()
  fetchImage()
  // isShown()
})

const exportToPDF = async (filename: string, element: HTMLElement | null) => {
  if (!element) {
    console.error('Element to export is not found.');
    return;
  }

  try {
    console.log('Starting PDF export...');

    // Wait for the image to load
    if (imageUrl.value) {
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl.value;
        img.onload = resolve;
        img.onerror = reject;
      });
    }

    const canvas = await html2canvas(element, { scale: 2 });
    console.log('Canvas generated successfully:', canvas);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    console.log('PDF exported successfully.');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};


</script>

<style scoped>
/* Restyled receipt */

/* Styling for the main container */
.print:m-auto {
  width: 210mm; /* A4 width */
  margin: auto;
}

/* Styling for the receipt container */
.pdfSection {
  width: 100%; /* Make sure it's full width */
  padding: 20px; /* Add some padding */
}

/* Rest of your styles */
</style>
