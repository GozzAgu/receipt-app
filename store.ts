import { defineStore } from 'pinia'
import type { RuleForm } from './types'

export const useStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as RuleForm[]
  }),

  
  actions: {
    createReceipt() {
      
    }
  },
})