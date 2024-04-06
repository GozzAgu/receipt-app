<template>
  <div class="print:m-auto px-4 sm:px-20 py-12 min-h-screen">
    <div class="max-w-3xl mx-auto">
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

      <div ref="pdfSection" v-loading="loading" class="border rounded-lg shadow-lg bg-white">
        <div class="flex justify-between items-center px-4 py-2 bg-sky-100 rounded-t-lg">
          <div class="flex items-center">
            <img v-if="authStore.currentUser?.imageUrl" :src="authStore.currentUser.imageUrl" class="w-4 h-4 mr-1" />
            <p class="font-bold text-xs text-sky-600">snapB!LL</p>
          </div>
          <p class="text-xs text-sky-600">{{ rpt?.date }}</p>
        </div>

        <div class="px-4 pb-4 text-sm">
          <el-divider content-position="left"><span class="text-base">Transaction Receipt</span></el-divider>

          <div class="font-light mt-4 text-xs md:text-base">
            <p>Dear {{ rpt?.customerName }},</p>
            <p>Below are your purchase details from <span class="font-semibold">{{ rpt?.name }}</span></p>
          </div>

          <div class="text-xs md:text-base grid md:grid-cols-2 gap-2 mt-4">
            <div class="bg-gray-100 rounded-lg p-2">
              <p class="font-semibold">Customer Name</p>
              <p>{{ rpt?.customerName }}</p>
            </div>
            <div class="bg-gray-100 rounded-lg p-2">
              <p class="font-semibold">Customer Address</p>
              <p>{{ rpt?.customerAddress }}</p>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Product</p>
                <p>{{ rpt?.productName }}</p>
              </div>
              <div v-if="rpt?.swapFrom" class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Swapped from</p>
                <p>{{ rpt?.swapFrom }}</p>
              </div>
            </div>
            <div class="bg-gray-100 rounded-lg p-2">
              <p class="font-semibold">Description</p>
              <p>{{ rpt?.productDescription }}</p>
            </div>
            <div class="grid grid-cols-2 gap-[0.2em]">
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Quantity</p>
                <p>{{ rpt?.productQuantity }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Unit price</p>
                <p>{{ rpt?.productPrice }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Paid via</p>
                <p>{{ rpt?.paidVia }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-bold">Total Price</p>
                <p>{{ rpt?.newPrice }}</p>
              </div>
            </div>
          </div>
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

const authStore = useAuthStore()
const pdfSection = ref<HTMLElement | null>(null)
const store = useStore()
const route = useRoute()
const loading = ref(true)

const isShown = () => {
  if(rpt.value) {
    loading.value = false
  }
}

const r = computed(() => {
  return route.params.id
})

const rpt = computed(() => {
  return store.receipts.find(re => re.id == r.value)
})

onMounted(async () => {
  isShown()
  store.fetchReceipts()
})

const exportToPDF = async (filename: string, element: HTMLElement | null) => {
  if (!element) {
    console.error('Element to export is not found.')
    return;
  }

  try {
    console.log('Starting PDF export...')
    const canvas = await html2canvas(element, { scale: 2 })
    console.log('Canvas generated successfully:', canvas)

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(filename)
    console.log('PDF exported successfully.')
  } catch (error) {
    console.error('Error exporting to PDF:', error)
  }
}

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
