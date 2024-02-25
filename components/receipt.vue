<template>
  <div class="px-[1.5em] py-[3em] bg-blue-50 h-[50em]">
    <div>
      <div class="border mt-[4em] px-[1em] py-[2em] bg-white rounded-lg shadow-lg" ref="pdfSection">
        <div class="flex justify-between pt-[1em] px-[1em]">
          <div class="flex gap-x-[0.5em]">
            <img class="w-[1em] h-[1em]" src="/public/snapbill-logo.png" />
            <p class="font-bold text-[0.6em] text-sky-600">snapB!LL</p>
          </div>
          <p class="text-xs">{{ rpt.date }}</p>
        </div>

        <div class="py-[1em] px-[1em] text-sm">
          <!-- <div class="flex justify-between"> -->
            <el-divider content-position="left"><span class="text-lg">Transaction Receipt</span></el-divider>
          <!-- </div> -->
          <div class="text-xs">
            <p>Dear {{ rpt.customerName }},</p>
            <p>Below are your purchase details from <span>{{ rpt.name }}</span></p>
            <p>Be sure to keep this document safe</p>
          </div>
          <div class="bg-white py-[1em] border rounded-lg text-xs mt-[2em] grid grid-cols-1 gap-y-[1em] px-[0.5em]">
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Customer Name </p>
              <p>{{ rpt.customerName }}</p>
            </div>
            <hr>
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Product Name </p>
              <p>{{ rpt.productName }}</p>
            </div>
            <hr>
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Description </p>
              <p>{{ rpt.productDescription }}</p>
            </div>
            <hr>
            <div class="grid grid-cols-2 bg-white rounded-lg px-[1em]">
              <p>Quantity </p>
              <p>{{ rpt.productQuantity }}</p>
            </div>
          </div>

          <div class="flex w-[full] justify-between bg-white rounded-lg mt-[2em]">
            <p class="text-sm">Total Price </p>
            <p class="">₦{{ rpt.productPrice }}</p>
          </div>
        </div>
      </div>

      <el-button @click="exportToPDF('my-pdf-file.pdf', pdfSection)" class="mt-[3em]" type="primary"> Download Receipt </el-button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../store"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const pdfSection = ref<HTMLElement | null>(null)
const store = useStore()
const route = useRoute()

const r = computed(() => {
  return route.params.id
})

const rpt = computed(() => {
  return store.receipts.find(re => re.id == r.value) || {}
})

onMounted(async () => {
  store.fetchReceipts()
  console.log()
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