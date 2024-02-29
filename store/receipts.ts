import { defineStore } from 'pinia'
import type { RuleForm } from '../types'
import { collection, addDoc, setDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore"


export const useStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as RuleForm[],
  }),

  
  actions: {
    async addReceipt(newCompanyDetails:RuleForm) {
      const nuxtApp = useNuxtApp()
      const receiptOf = nuxtApp.$auth.currentUser?.uid
      const docRef = await addDoc(collection(nuxtApp.$firestore, "receipts"), {
        newCompanyDetails
      });

      newCompanyDetails.id = docRef.id
      const newDocRef = await setDoc(doc(nuxtApp.$firestore, "receipts", docRef.id), {
        ...newCompanyDetails,
        id: docRef.id,
        receiptOf: receiptOf
      });
      this.receipts.push(newCompanyDetails)
      return docRef.id
    },

    fetchReceipts() {
      const nuxtApp = useNuxtApp()
      const querySnapshot = collection(nuxtApp.$firestore, "receipts")
      onSnapshot(querySnapshot, (GuestsSnapshot) => {
        this.receipts = [];
        GuestsSnapshot.forEach((doc) => {
          if (doc.data().receiptOf === nuxtApp.$auth.currentUser?.uid) {
            let receiptData = doc.data() as RuleForm;
            receiptData.id = doc.id;
            this.receipts.unshift({...receiptData, id:receiptData.id} as RuleForm);
          }
        });
      })
    },

    async deleteReceipt(index:string) {
      const nuxtApp = useNuxtApp()
      await deleteDoc(doc(nuxtApp.$firestore, "receipts", index));
    },
  },
})