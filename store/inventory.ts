import { defineStore } from 'pinia'
import type { Inventory } from "~/types/types"
import { collection, addDoc, updateDoc, setDoc, doc, deleteDoc, where, query, onSnapshot, getDoc, getDocs } from "firebase/firestore"
import { useAuthStore } from './users'

export const useInventoryStore = defineStore('inventories', {
  state: () => ({
    inventories: [] as Inventory[]
  }),

  actions: {
    async addToInventory(entry:Inventory) {
        const nuxtApp = useNuxtApp()
        const authStore = useAuthStore()
        if(authStore.currentUser?.accountType === 'admin') {
          const inventoryOf = nuxtApp.$auth.currentUser?.uid
          const docRef = await addDoc(collection(nuxtApp.$firestore, "inventories"), {
            entry
          })
          entry.id = docRef.id
          const newDocRef = await setDoc(doc(nuxtApp.$firestore, "inventories", docRef.id), {
            ...entry,
            id: docRef.id,
            inventoryOf: inventoryOf
          });
          this.inventories.push(entry)
          return docRef.id
        } 
        else if(authStore.currentUser?.accountType === 'manager' || authStore.currentUser?.accountType === 'midAdmin') {
          const manager = doc(nuxtApp.$firestore, "users", nuxtApp.$auth.currentUser?.uid)
          const docSnap = await getDoc(manager) 
          if(docSnap.exists()) {
            const inventoryOf = docSnap.data().adminId
            const docRef = await addDoc(collection(nuxtApp.$firestore, "inventories"), {
                entry
            })
            entry.id = docRef.id
            const newDocRef = await setDoc(doc(nuxtApp.$firestore, "inventories", docRef.id), {
              ...entry,
              id: docRef.id,
              inventoryOf: inventoryOf
            });
            this.inventories.push(entry)
            return docRef.id
          }
        }
    },

    async updateInventorySoldStatus(imei: string, sold: boolean) {
      const nuxtApp = useNuxtApp();
      const inventoryItem = this.inventories.find(item => item.imei === imei);
      
      if (inventoryItem) {
          const inventoryRef = doc(nuxtApp.$firestore, "inventories", inventoryItem.id);
          await updateDoc(inventoryRef, { sold: sold });
          inventoryItem.sold = sold;
      } else {
          console.log(`No inventory item found for IMEI: ${imei}`);
      }
    },

    async fetchInventories() {
      const nuxtApp = useNuxtApp()
      const authStore = useAuthStore()
      if (!authStore.currentUser) return
      const querySnapshot = collection(nuxtApp.$firestore, "inventories")
      onSnapshot(querySnapshot, async (ReceiptsSnapshot) => {
        this.inventories = []
        if (authStore.currentUser?.accountType === 'admin') {
          ReceiptsSnapshot.forEach((doc) => {
            const inventoryData = doc.data() as Inventory
            if(inventoryData.inventoryOf === authStore.currentUser?.id) { 
              inventoryData.inventoryOf = doc.data().inventoryOf
              this.inventories.push(inventoryData as Inventory)
            }
          })
        } else if (authStore.currentUser?.accountType === 'manager' || authStore.currentUser?.accountType === 'midAdmin') {
          const managerDocRef = doc(nuxtApp.$firestore, 'users', authStore.currentUser?.adminId)
          const managerDocSnapshot = await getDoc(managerDocRef)
          const adminId = managerDocSnapshot.data()?.id
          if (!adminId) return
          this.inventories = []
          ReceiptsSnapshot.forEach((doc) => {
            const inventoryData = doc.data() as Inventory
            if (inventoryData.inventoryOf === authStore.currentUser?.uid || inventoryData.inventoryOf === adminId) {
              this.inventories.push({ ...inventoryData, id: doc.id } as Inventory)
            }
          })
        }
      })
    },

    editInventory(entry:Inventory){
      const idx = this.inventories.findIndex(e => e.imei === entry.imei)
      this.inventories[idx] = entry
    },

    searchInventoryByIMEI(imei: string){
      return this.inventories.find(item => item.imei === imei)
    },
  }
})