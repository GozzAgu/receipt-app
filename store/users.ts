import { defineStore } from 'pinia'
import type { Manager, Admin } from '../types/types'
import { collection, addDoc, setDoc, doc, onSnapshot } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import type { User } from 'firebase/auth/cordova';

export const useStore = defineStore('users', {
  state: () => ({
    managers: [] as Manager[],
    admins: [] as Admin[],
    currentUser: null as null | User & {password: string}
  }),

  actions: {
    async signupAdmin(email:string, password:string) {
      const nuxtApp = useNuxtApp()
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return response
    },

    async signin(email:string, password:string) {
      const nuxtApp = useNuxtApp()
      const response = await signInWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password }
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

    async addManager(manager:Manager) {
      const nuxtApp = useNuxtApp()
      manager.adminId = nuxtApp.$auth.currentUser?.uid
      const response = await addDoc(collection(nuxtApp.$firestore, "users"), {
        manager
      });
      manager.id = response.id
      const newDocRef = await setDoc(doc(nuxtApp.$firestore, "users", response.id), {
        ...manager,
        id: response.id,
      });
      this.managers.push(manager)
      return response.id
    },

    fetchManagers() {
      const nuxtApp = useNuxtApp()
      const querySnapshot = collection(nuxtApp.$firestore, "users")
      onSnapshot(querySnapshot, (UsersSnapshot) => {
        this.managers = [];
        UsersSnapshot.forEach((doc) => {
          let userData = doc.data() as Manager;
          userData.id = doc.id;
          console.log(userData.id)
          this.managers.unshift(userData as Manager);
          console.log(this.managers)
        });
      })
    },
  },

  // loadCurrentUserFromStorage() {
  //   const storedUser = localStorage.getItem('currentUser')
  //   if (storedUser) {
  //     this.currentUser = JSON.parse(storedUser)
  //   }
  // },
})