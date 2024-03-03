// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@element-plus/nuxt',
    '@sidebase/nuxt-pdf',
    "nuxt-particles"
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  runtimeConfig: {
    public: {
      FB_API_KEY : process.env.FIREBASE_KEY,
    }
  },
  // router: {
  //   middleware: 'auth'
  // },
})