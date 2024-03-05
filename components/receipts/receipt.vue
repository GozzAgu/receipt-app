<template>
  <div class="print:w-full print:min-h-full print:p-0 print:m-0">
    <div class="print:max-w-a4 print:m-auto px-4 md:px-20 py-12 bg-blue-50 min-h-screen">
      <div class="max-w-3xl mx-auto">
        <div v-loading="loading" class="border rounded-lg shadow-lg bg-white mt-[4em]">
          <div class="flex justify-between items-center px-4 py-3 bg-blue-100 rounded-t-lg">
            <div class="flex items-center">
              <img class="w-6 h-6 mr-2" src="/snapbill-logo.png" alt="SnapBill Logo" />
              <p class="font-bold text-sm text-blue-800">snapB!LL</p>
            </div>
            <p class="text-sm">{{ rpt?.date }}</p>
          </div>

          <div class="p-4 text-sm">
            <el-divider content-position="left"><span class="text-lg">Transaction Receipt</span></el-divider>

            <div class="font-light mt-4">
              <p>Dear {{ rpt?.customerName }},</p>
              <p>Below are your purchase details from <span class="font-semibold">{{ rpt?.name }}</span></p>
              <p>Please keep this document safe.</p>
            </div>

            <div class="grid md:grid-cols-2 gap-2 mt-4">
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Customer Name</p>
                <p>{{ rpt?.customerName }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Customer Address</p>
                <p>{{ rpt?.customerAddress }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Product</p>
                <p>{{ rpt?.productName }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Description</p>
                <p>{{ rpt?.productDescription }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Quantity</p>
                <p>{{ rpt?.productQuantity }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Unit price</p>
                <p>{{ rpt?.productPrice }}</p>
              </div>
              <div class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Mode of payment</p>
                <p>{{ rpt?.paidVia }}</p>
              </div>
            </div>

            <div class="flex justify-between items-center bg-gray-100 rounded-lg p-4 mt-4">
              <p class="font-semibold">Total Price</p>
              <p class="text-lg font-bold">₦{{ rpt?.newPrice }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <NuxtLink to="/receiptTable">
            <el-button class="py-2 px-4" type="primary">
              <el-icon><Back /></el-icon>
              <span class="ml-2 text-sm md:text-base">Back</span>
            </el-button>
          </NuxtLink>

          <el-button class="py-2 px-4" type="success" @click="exportToPDF('my-pdf-file.pdf', pdfSection)">
            <Icon name="line-md:download-loop" color="white" size="20" />
            <span class="ml-2 text-sm md:text-base">Download Receipt</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <div class="px-4 md:px-20 py-12 bg-blue-50 min-h-screen">
    
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Back } from '@element-plus/icons-vue'

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
    return;
  }

  try {
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(filename)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
  }
}
</script>

<style scoped>
@media print {
  .print:w-full {
    width: 100% !important;
  }
  .print:min-h-full {
    min-height: 100% !important;
  }
  .print:p-0 {
    padding: 0 !important;
  }
  .print:m-0 {
    margin: 0 !important;
  }
  .print:max-w-a4 {
    max-width: 210mm !important;
  }
  .print:m-auto {
    margin: auto !important;
  }
}
</style>