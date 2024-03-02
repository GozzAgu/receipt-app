import { defineStore } from 'pinia'
import type { RuleForm } from '../types/types'
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore"


export const useStore = defineStore('invoices', {
  state: () => ({
    invoices: [] as RuleForm[]
  }),

  
  actions: {
    async addInvoice(newCompanyDetails:RuleForm) {
      const nuxtApp = useNuxtApp()
      const docRef = await addDoc(collection(nuxtApp.$firestore, "invoices"), {
        newCompanyDetails
      });
      newCompanyDetails.id = docRef.id
      const newDocRef = await setDoc(doc(nuxtApp.$firestore, "invoices", docRef.id), {
        ...newCompanyDetails,
        id: docRef.id
      });
      this.invoices.push(newCompanyDetails)
      return docRef.id
    },

    async fetchInvoices() {
      const nuxtApp = useNuxtApp()
      this.invoices = [];
      const querySnapshot = await getDocs(collection(nuxtApp.$firestore, "invoices"))
      querySnapshot.forEach((doc) => {
        this.invoices.push({...doc.data(), id: doc.id} as RuleForm)
      });
    },

    async deleteInvoice(index:string) {
      const nuxtApp = useNuxtApp()
      await deleteDoc(doc(nuxtApp.$firestore, "invoices", index));
    },
  },
})