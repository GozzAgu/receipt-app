import { defineStore } from 'pinia'
import { type Manager, type Admin, type MidAdmin } from '../types/types'
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth'
import type { User } from 'firebase/auth/web-extension'

export const useAuthStore = defineStore('users', {
  state: () => ({
    managers: [] as Manager[],
    managerAdmin: null as null | Admin & { adminId: string, adminName: string, id:string },
    admins: [] as Admin[],
    currentUser: null as null | User & { password: string, accountType: string, id: string, adminName?: string },
  }),

  actions: {
    authenticated() {
      const router = useRouter()
      if(!this.currentUser) {
        router.push('/auth/signin')
      }
    },

    async signupAdmin(email:string, password:string, accountType:string, adminName:string) {
      const nuxtApp = useNuxtApp()
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType, id: response.user.uid, adminName: adminName }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return response
    },
    
    async signin(email:string, password:string, accountType: string) {
      const nuxtApp = useNuxtApp()
      const response = await signInWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType, id: response.user.uid }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return user
    },

    loadCurrentUserFromStorage() {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser)
      }
    },

    async fetchCurrentUser(id:string) {
      const nuxtApp = useNuxtApp()
      try{
        if (!id) {
          throw new Error("Invalid user ID")
        }
        const userDocRef = doc(nuxtApp.$firestore, 'users',id)
        const userDocSnapshot = await getDoc(userDocRef)
        this.currentUser = userDocSnapshot.data()
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        return this.currentUser
      }
      catch(error){
        console.log(error)
      }
    },

    async fetchManagerAdmin() {
      const nuxtApp = useNuxtApp()
      const userDocRef = doc(nuxtApp.$firestore, 'users', this.currentUser?.adminId)
      const userDocSnapshot = await getDoc(userDocRef)
      this.managerAdmin = userDocSnapshot.data()
    },

    fetchManagers() {
      const nuxtApp = useNuxtApp()
      const querySnapshot = collection(nuxtApp.$firestore, "users")
      onSnapshot(querySnapshot, (UsersSnapshot) => {
        this.managers = [];
        UsersSnapshot.forEach((doc) => {
          let userData = doc.data() as Manager;
          userData.id = doc.id;
          if (userData.accountType === 'manager' || userData.accountType === 'midAdmin' && userData.adminId === this.currentUser?.id) 
          {
            this.managers.unshift(userData as Manager)
          }
        });
      })
    },
  },
})