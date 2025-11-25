import { defineStore } from 'pinia'
import { auth } from '~/firebase/firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    isAuthenticated: false,
    authIsReady: false,
  }),

  getters: {
    userId: (state) => state.user?.uid || null,
  },

  actions: {
    setUser(user: any) {
      this.user = user
      this.isAuthenticated = !!user
      this.authIsReady = true
    },

    // -------------------------
    // REGISTRO
    // -------------------------
    async register(email: string, password: string) {
      try {
        const { createUserWithEmailAndPassword } = await import('firebase/auth')
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        return userCredential.user
      } catch (error) {
        throw error
      }
    },

    // -------------------------
    // LOGIN
    // -------------------------
    async login(email: string, password: string) {
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth')
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user
      } catch (error) {
        throw error
      }
    },

    // -------------------------
    // LOGOUT
    // -------------------------
    async logout() {
      try {
        const { signOut } = await import('firebase/auth')
        await signOut(auth)
      } catch (error) {
        throw error
      }
    },
  },
})
