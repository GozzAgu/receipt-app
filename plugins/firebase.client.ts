import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import 'firebase/storage'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: 'AIzaSyDblBZeFWLlnqEujW05cwGGnx8F9VI9w4E',
    authDomain: "snapbill-f82ec.firebaseapp.com",
    projectId: "snapbill-f82ec",
    storageBucket: "snapbill-f82ec.appspot.com",
    messagingSenderId: "173245351659",
    appId: "1:173245351659:web:c49c2d3adf23f0398020ae",
    measurementId: "G-ZZ57HY7TWG"
  };

  const app = initializeApp(firebaseConfig)

  console.log(app)
  const firestore = getFirestore(app)
  const auth = getAuth(app)
  const storage = getStorage(app)

  // nuxtApp.vueApp.provide('firestore', firestore)
  // nuxtApp.provide('firestore', firestore)
  return {
    provide: {
      firestore,
      auth,
      storage
    }
  }
})