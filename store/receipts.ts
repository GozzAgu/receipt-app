import { defineStore } from 'pinia'
import type { Receipt } from '../types/types'
import { collection, addDoc, setDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore"


export const useStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as Receipt[],
  }),

  
  actions: {
    async addReceipt(newCompanyDetails:Receipt) {
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
      onSnapshot(querySnapshot, (ReceiptsSnapshot) => {
        this.receipts = [];
        ReceiptsSnapshot.forEach((doc) => {
          if (doc.data().receiptOf === nuxtApp.$auth.currentUser?.uid) {
            let receiptData = doc.data() as Receipt;
            receiptData.id = doc.id;
            this.receipts.unshift({...receiptData, id:receiptData.id} as Receipt);
          }
        });
      })
    },

    async deleteReceipt(index:any) {
      const nuxtApp = useNuxtApp()
      await deleteDoc(doc(nuxtApp.$firestore, "receipts", index));
    },
  },
})