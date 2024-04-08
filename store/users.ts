import { defineStore } from 'pinia'
import { type Manager, type Admin } from '../types/types'
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import type { User } from 'firebase/auth/web-extension';

export const useAuthStore = defineStore('users', {
  state: () => ({
    managers: [] as Manager[],
    managerAdmin: null as null | Admin,
    admins: [] as Admin[],
    currentUser: null as null | User & { password: string, accountType: string },
  }),

  actions: {
    async signupAdmin(email:string, password:string, accountType:string) {
      const nuxtApp = useNuxtApp()
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return response
    },
    
    async signin(email:string, password:string, accountType: string) {
      const nuxtApp = useNuxtApp()
      const response = await signInWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return response
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
        const userDocRef = doc(nuxtApp.$firestore, 'users',id)
        const userDocSnapshot = await getDoc(userDocRef)
        console.log(userDocSnapshot.data())
        this.currentUser = userDocSnapshot.data()

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        console.log(this.currentUser)

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
        console.log(userDocSnapshot.data())
    },

    fetchManagers() {
      const nuxtApp = useNuxtApp()
      const querySnapshot = collection(nuxtApp.$firestore, "users")
      onSnapshot(querySnapshot, (UsersSnapshot) => {
        this.managers = [];
        UsersSnapshot.forEach((doc) => {
          let userData = doc.data() as Manager;
          userData.id = doc.id;
          if (userData.accountType === "manager" && userData.adminId === this.currentUser?.uid) {
            this.managers.unshift(userData as Manager)
          }
        });
      })
    },
  },
})