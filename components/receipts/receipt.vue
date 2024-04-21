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

      <div ref="pdfSection" v-loading="loading" class="shadow-lg rounded-lg bg-white py-[2rem]">
        <div class="px-[3rem] pb-4 text-sm">
          <el-divider content-position="left"><span class="text-base">Transaction Receipt</span></el-divider>

          <div class="flex justify-between my-[1rem] text-gray-500">
            <div>
              <div class="flex gap-x-[1rem]">
                <img v-if="authStore.currentUser?.imageUrl || authStore.managerAdmin?.imageUrl" :src="authStore.currentUser?.imageUrl || authStore.managerAdmin?.imageUrl" class="w-6 h-6" />
                <p class="text-lg font-semibold">{{ authStore.currentUser?.adminName || authStore.managerAdmin?.adminName }}</p>
              </div>
              <p class="text-xs mt-[0.5rem]"><Icon class="mr-[0.3rem]" name="solar:map-point-outline"/>- {{ authStore.currentUser?.address || authStore.managerAdmin?.address }}</p>
              <p class="text-xs my-[0.2rem]"><Icon class="mr-[0.3rem]" name="solar:phone-linear"/>- {{ authStore.currentUser?.phone || authStore.managerAdmin?.phone }}</p>
              <p class="text-xs my-[0.2rem]"><Icon class="mr-[0.3rem]" name="solar:mailbox-broken"/>- {{ authStore.currentUser?.email || authStore.managerAdmin?.email }}</p>
            </div>

            <div>
              <p class="text-gray-500 font-light text-xs">{{ rpt?.date }}</p>
            </div>
          </div>

          <hr>

          <div class="text-xs text-gray-500 mt-[1rem]">
            <p><Icon class="mr-[0.3rem]" name="solar:bill-line-duotone" /> Bill for : {{ rpt?.productName }}</p>
            <p><Icon class="mr-[0.3rem]" name="solar:bicycling-bold" /> Bill to : {{ rpt?.customerName }}</p>
            <p><Icon class="mr-[0.3rem]" name="solar:map-point-outline"/> Address : {{ rpt?.customerAddress }}</p>
          </div>

          <div class="border-2 rounded-xl p-[1rem] mt-[1rem]">
            <table class="w-full text-xs">
              <thead>
                <tr>
                  <th class="font-light text-left border-b">Description</th>
                  <th class="font-light text-left border-b">Rate</th>
                  <th class="font-light text-left border-b">Quantity</th>
                  <th class="font-light text-left border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-light text-xs py-[1rem]">{{ rpt?.productDescription }}</td>
                  <td class="font-light text-xs">₦{{ rpt?.productPrice }}</td>
                  <td class="font-light text-xs">{{ rpt?.productQuantity }}</td>
                  <td class="font-light text-xs">₦{{ rpt?.newPrice }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- <div class="font-light mt-4 text-xs md:text-base">
            <p class="text-xs">Dear {{ rpt?.customerName }},</p>
            <p class="text-xs">Below are your purchase details from <span class="font-semibold">{{ authStore.currentUser?.adminName || authStore.managerAdmin?.adminName }}, </span></p>
            <p class="text-xs">{{ authStore.currentUser?.address || authStore.managerAdmin?.address }}</p>
          </div> -->

          <!-- <div class="text-xs font-light grid md:grid-cols-2 gap-2 mt-4">
            <div class="bg-gray-50 rounded-lg p-2">
              <p class="font-semibold">Customer Name</p>
              <p>{{ rpt?.customerName }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-2">
              <p class="font-semibold">Customer Address</p>
              <p>{{ rpt?.customerAddress }}</p>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-gray-50 rounded-lg p-2">
                <p class="font-semibold">Product</p>
                <p>{{ rpt?.productName }}</p>
              </div>
              <div v-if="rpt?.swapFrom" class="bg-gray-100 rounded-lg p-2">
                <p class="font-semibold">Swapped from</p>
                <p>{{ rpt?.swapFrom }}</p>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-2">
              <p class="font-semibold">Description</p>
              <p>{{ rpt?.productDescription }}</p>
            </div>
            <div class="grid grid-cols-2 gap-[0.2em]">
              <div class="bg-gray-50 rounded-lg p-2">
                <p class="font-semibold">Quantity</p>
                <p class="font-mono">{{ rpt?.productQuantity }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2">
                <p class="font-semibold">Unit price</p>
                <p class="font-mono">{{ rpt?.productPrice }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2">
                <p class="font-semibold">Paid via</p>
                <p>{{ rpt?.paidVia }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2">
                <p class="font-bold">Total Price</p>
                <p class="font-mono">{{ rpt?.newPrice }}</p>
              </div>
            </div>
          </div> -->
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
  await store.fetchReceipts()
  isShown()
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
