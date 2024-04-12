import { useAuthStore } from "~/store/users"

const auth = defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore()

  if (!user.currentUser)
    return navigateTo('/auth/signin')
})

export default auth