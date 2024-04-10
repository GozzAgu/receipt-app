import type { Inventory } from "~/types/types"
import { collection, addDoc, setDoc, doc, deleteDoc, where, query, onSnapshot, getDoc, getDocs } from "firebase/firestore"
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
            else if(authStore.currentUser?.accountType === 'manager') {
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
            } else if (authStore.currentUser?.accountType === 'manager') {
              const managerDocRef = doc(nuxtApp.$firestore, 'users', authStore.currentUser?.uid)
              const managerDocSnapshot = await getDoc(managerDocRef)
              const adminId = managerDocSnapshot.data()?.adminId
              if (!adminId) return
              ReceiptsSnapshot.forEach((doc) => {
                const inventoryData = doc.data() as Inventory
                if (inventoryData.inventoryOf === authStore.currentUser?.uid || inventoryData.inventoryOf === adminId) {
                  this.inventories.push({ ...inventoryData, id: doc.id } as Inventory)
                }
              })
            }
          })
        },

        // async fetchInventories() {
        //     const nuxtApp = useNuxtApp()
        //     const authStore = useAuthStore()
        //     const querySnapshot = collection(nuxtApp.$firestore, "inventories")
        //     onSnapshot(querySnapshot, async(ReceiptsSnapshot) => {
        //       const manager = doc(nuxtApp.$firestore, "users", authStore.currentUser?.uid)
        //       const docSnap = await getDoc(manager) 
        //       this.inventories = []
        //       ReceiptsSnapshot.forEach((doc) => {
        //         if(doc.data().inventoryOf === authStore.currentUser?.uid || doc.data().inventoryOf === docSnap.data()?.adminId) { 
        //           let inventoryData = doc.data() as Inventory
        //           inventoryData.inventoryOf = doc.data().inventoryOf
        //           this.inventories.push({...inventoryData} as Inventory)
        //         }
        //       })
        //     })
        // },

        editInventory(entry:Inventory){
            const idx = this.inventories.findIndex(e => e.imei === entry.imei)
            this.inventories[idx] = entry
        },

        searchInventoryByIMEI(imei: string){
            return this.inventories.find(item => item.imei === imei)
        }
    }
})