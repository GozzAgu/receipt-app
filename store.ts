import { defineStore } from 'pinia'

export const useStore = defineStore('receipts', {
  state: () => ({
    receipts: []
  }),

  
  actions: {
    createReceipt() {
      
    }
  },
})