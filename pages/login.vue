<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="loading"
            class="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="ejemplo@dominio.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            :disabled="loading"
            class="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span v-if="!loading">Acceder</span>
          <span v-else>Cargando...</span>
        </button>
        
        <p class="text-center text-sm text-gray-600">
          ¿No tienes cuenta?
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">Regístrate aquí</NuxtLink>
        </p>
      </form>
      
      <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

// 1. Deshabilitar el middleware 'auth' en esta página.
// Es una página pública a la que incluso los usuarios logueados deberían poder acceder
// para, por ejemplo, ver el error de "ya estás logueado" o forzar un re-login.
// Sin embargo, el middleware nos redirigirá si ya está logueado (ver `middleware/auth.ts`).
definePageMeta({
  layout: 'default' // Puedes usar un layout simple si lo deseas
});

// 2. Estado de la página

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

/**
 * Maneja el envío del formulario de login.
 */
async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Por favor, introduce tu email y contraseña.';
    return;
  }
  
  loading.value = true;
  error.value = null; // Limpiar errores anteriores

  try {
    // 3. Llamar a la acción de login del Store de Pinia
    await authStore.login(email.value, password.value);

    // 4. Redirección en caso de éxito
    // El middleware se encarga de que la redirección sea segura.
    await navigateTo('/', { replace: true });

  } catch (err: any) {
    // 5. Manejo de errores de Firebase
    if (err.code) {
      error.value = mapFirebaseError(err.code);
    } else {
      error.value = 'Ocurrió un error inesperado al iniciar sesión.';
    }
    
  } finally {
    loading.value = false;
  }
}

/**
 * Función auxiliar para mapear códigos de error de Firebase a mensajes amigables.
 */
function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Verifica tu email y contraseña.';
    case 'auth/invalid-email':
      return 'El formato del email es incorrecto.';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada.';
    default:
      console.error(code);
      return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
}
</script>

<style scoped>
/* Puedes añadir estilos específicos si es necesario, pero Tailwind maneja la mayoría */
</style>