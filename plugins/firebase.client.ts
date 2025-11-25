import { useAuthStore } from '~/stores/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '~/firebase/firebase'

export default defineNuxtPlugin(() => {
  // Se asegura de que Pinia YA está disponible
  const authStore = useAuthStore()

  // No uses Promises ni async en plugins que dependen de stores
  onAuthStateChanged(auth, (user) => {
    authStore.setUser(user)
  })

  return {
    provide: {
      auth
    }
  }
})
