import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import 'firebase/storage'
import { getStorage, ref, uploadString } from 'firebase/storage'

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

  const firestore = getFirestore(app)
  const auth = getAuth(app)
  const storage = getStorage(app)

  const saveFile = (fullPath:any, file:any) => {
    const imagesRef = ref(storage, fullPath)
    const storageRef = ref(storage, 'image.txt')
    const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
    uploadString(storageRef, message4, 'data_url').then((snapshot) => {
      console.log('Uploaded a data_url string!')
    })
  }

  return {
    provide: {
      firestore,
      auth,
      saveFile
    }
  }
})