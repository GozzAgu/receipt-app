import { defineStore } from 'pinia'
import type { Receipt } from '../types/types'
import { collection, addDoc, setDoc, doc, deleteDoc, where, query, onSnapshot, getDoc, getDocs } from "firebase/firestore"
import { useAuthStore } from './users'

export const useStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as Receipt[],
  }),

  actions: {
    async addReceipt(newCompanyDetails:Receipt) {
      const nuxtApp = useNuxtApp()
      const authStore = useAuthStore()
      if(authStore.currentUser?.accountType === 'admin') {
        const receiptOf = nuxtApp.$auth.currentUser?.uid
        const docRef = await addDoc(collection(nuxtApp.$firestore, "receipts"), {
          newCompanyDetails
        })
        newCompanyDetails.id = docRef.id
        const newDocRef = await setDoc(doc(nuxtApp.$firestore, "receipts", docRef.id), {
          ...newCompanyDetails,
          id: docRef.id,
          receiptOf: receiptOf
        });
        this.receipts.push(newCompanyDetails)
        return docRef.id
      } 
      else if(authStore.currentUser?.accountType === 'manager') {
        const manager = doc(nuxtApp.$firestore, "users", nuxtApp.$auth.currentUser?.uid)
        const docSnap = await getDoc(manager) 
        if(docSnap.exists()) {
          const receiptOf = docSnap.data().adminId
          const docRef = await addDoc(collection(nuxtApp.$firestore, "receipts"), {
            newCompanyDetails
          })
          newCompanyDetails.id = docRef.id
          const newDocRef = await setDoc(doc(nuxtApp.$firestore, "receipts", docRef.id), {
            ...newCompanyDetails,
            id: docRef.id,
            receiptOf: receiptOf
          });
          this.receipts.push(newCompanyDetails)
          return docRef.id
        }
      }
    },

    async fetchReceipts() {
      const nuxtApp = useNuxtApp()
      const authStore = useAuthStore()
      if (!authStore.currentUser) return
      const querySnapshot = collection(nuxtApp.$firestore, "receipts")
      onSnapshot(querySnapshot, async (ReceiptsSnapshot) => {
        if (authStore.currentUser?.accountType === 'admin') {
          this.receipts = []
          ReceiptsSnapshot.forEach((doc) => {
            const receiptData = doc.data() as Receipt
            if(receiptData.receiptOf === authStore.currentUser?.id) { 
              receiptData.receiptOf = doc.data().receiptOf
              this.receipts.push(receiptData as Receipt)
            }
          })
        } else if (authStore.currentUser?.accountType === 'manager') {
          const managerDocRef = doc(nuxtApp.$firestore, 'users', authStore.currentUser?.adminId)
          const managerDocSnapshot = await getDoc(managerDocRef)
          const adminId = managerDocSnapshot.data()?.id
          if (!adminId) return
          this.receipts = []
          ReceiptsSnapshot.forEach((doc) => {
            const receiptData = doc.data() as Receipt
            if (receiptData.receiptOf === authStore.currentUser?.uid || receiptData.receiptOf === adminId) {
              this.receipts.push({ ...receiptData, id: doc.id } as Receipt)
              console.log(this.receipts)
            }
          })
        }
      })
    },

    async deleteReceipt(index:any) {
      const nuxtApp = useNuxtApp()
      await deleteDoc(doc(nuxtApp.$firestore, "receipts", index));
    },
  },
})