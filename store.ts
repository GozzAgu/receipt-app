import { defineStore } from 'pinia'
import type { RuleForm } from './types'
import { collection, getDocs, addDoc } from "firebase/firestore"


export const useStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as RuleForm[]
  }),

  
  actions: {
    async addReceipt(newCompanyDetails:RuleForm) {
      const nuxtApp = useNuxtApp()
      const docRef = await addDoc(collection(nuxtApp.$firestore, "receipts"), {
        customer: newCompanyDetails
      });
      // newCompanyDetails.id = docRef.id
      this.receipts.push({...newCompanyDetails, id:docRef.id})
    },

    async fetchReceipts() {
      const nuxtApp = useNuxtApp()
      const querySnapshot = await getDocs(collection(nuxtApp.$firestore, "receipts"))
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data())
        this.receipts.push({...doc.data(), id: doc.id})
      });
    }
  },
})