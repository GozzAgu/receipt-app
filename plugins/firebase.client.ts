import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FB_API_KEY,
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

  nuxtApp.vueApp.provide('firestore', firestore)
  nuxtApp.provide('firestore', firestore)
})