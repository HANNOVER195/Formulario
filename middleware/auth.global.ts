// middleware/auth.ts

import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Rutas públicas reales de tu proyecto
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Usuario NO autenticado y quiere entrar a ruta privada
  if (!authStore.isAuthenticated && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Usuario SI está autenticado e intenta acceder al login
  if (authStore.isAuthenticated && isPublicRoute) {
    return navigateTo('/', { replace: true })
  }

  // Continuar navegación
})
