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
    
    // async fetchReceipts() {
    //   const nuxtApp = useNuxtApp()
    //   const authStore = useAuthStore()
    //   const querySnapshot = collection(nuxtApp.$firestore, "receipts")
    //   onSnapshot(querySnapshot, async(ReceiptsSnapshot) => {
    //     const receipt = doc(nuxtApp.$firestore, "users", authStore.currentUser?.uid)
    //     const docSnap = await getDoc(receipt)
    //     this.receipts = []
    //     ReceiptsSnapshot.forEach((doc) => {
    //       if(doc.data().receiptOf === authStore.currentUser?.uid || doc.data().receiptOf === docSnap.data()?.adminId) { 
    //         let receiptData = doc.data() as Receipt
    //         receiptData.receiptOf = doc.data().receiptOf
    //         this.receipts.push({...receiptData} as Receipt)
    //       }
    //     })
    //   })
    // },

    async fetchReceipts() {
      const nuxtApp = useNuxtApp()
      const authStore = useAuthStore()
      if (!authStore.currentUser) return
      const querySnapshot = collection(nuxtApp.$firestore, "receipts")
      onSnapshot(querySnapshot, async (ReceiptsSnapshot) => {
        this.receipts = []
        if (authStore.currentUser?.accountType === 'admin') {
          ReceiptsSnapshot.forEach((doc) => {
            const receiptData = doc.data() as Receipt
            if(receiptData.receiptOf === authStore.currentUser?.id) { 
              receiptData.receiptOf = doc.data().receiptOf
              this.receipts.push(receiptData as Receipt)
            }
          })
        } else if (authStore.currentUser?.accountType === 'manager') {
          const managerDocRef = doc(nuxtApp.$firestore, 'users', authStore.currentUser?.uid)
          const managerDocSnapshot = await getDoc(managerDocRef)
          const adminId = managerDocSnapshot.data()?.adminId
          if (!adminId) return
          ReceiptsSnapshot.forEach((doc) => {
            const receiptData = doc.data() as Receipt
            if (receiptData.receiptOf === authStore.currentUser?.uid || receiptData.receiptOf === adminId) {
              this.receipts.push({ ...receiptData, id: doc.id } as Receipt)
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