import { defineStore } from 'pinia'
import { type Manager, type Admin } from '../types/types'
import { collection, onSnapshot } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import type { User } from 'firebase/auth/web-extension';

export const useAuthStore = defineStore('users', {
  state: () => ({
    managers: [] as Manager[],
    admins: [] as Admin[],
    currentUser: null as null | User & { password: string, accountType: string, imageUrl: string, name: string, phone: string, address: string }
  }),

  actions: {
    async signupAdmin(email:string, password:string, accountType:string, imageUrl: string, name: string, phone: string, address: string) {
      const nuxtApp = useNuxtApp()
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType, imageUrl: imageUrl, name: name, phone: phone, address: address }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return response
    },

    // async uploadLogo(imageUrl: string) {
    //   this.currentUser = {...this.currentUser, imageUrl }
    //   localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    //   console.log(this.currentUser)
    // },

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