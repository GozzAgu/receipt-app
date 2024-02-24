import { defineStore } from 'pinia'
import type { RuleForm } from './types'
import { collection, getDocs, addDoc, setDoc, doc, query, where, onSnapshot } from "firebase/firestore"


export const useStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as RuleForm[]
  }),

  
  actions: {
    async addReceipt(newCompanyDetails:RuleForm) {
      const nuxtApp = useNuxtApp()
      const docRef = await addDoc(collection(nuxtApp.$firestore, "receipts"), {
        newCompanyDetails
      });
      newCompanyDetails.id = docRef.id
      const newDocRef = await setDoc(doc(nuxtApp.$firestore, "receipts", docRef.id), {
        ...newCompanyDetails,
        id: docRef.id
      });
      this.receipts.push(newCompanyDetails)
      return docRef.id
    },

    async fetchReceipts() {
      const nuxtApp = useNuxtApp()
      this.receipts = [];
      const querySnapshot = await getDocs(collection(nuxtApp.$firestore, "receipts"))
      querySnapshot.forEach((doc) => {
        this.receipts.push({...doc.data(), id: doc.id} as RuleForm)
      });
    },

    deleteReceipt(index) {
      console.log(index)
    }
  },
})