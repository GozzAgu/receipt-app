import { defineStore } from 'pinia'
import type { RuleForm } from './types'
// import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore"


export const useStore = defineStore('invoices', {
  state: () => ({
    invoices: [] as RuleForm[]
  }),

  
  actions: {
    addInvoice() {

    },

    fetchInvoices() {

    },

    deleteInvoices() {

    }
  },
})