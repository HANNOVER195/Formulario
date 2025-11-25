<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-gray-800">Crear Cuenta</h2>
      
      <!-- Formulario de Registro -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Campo Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="loading"
            class="w-full px-4 py-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="ejemplo@dominio.com"
          />
        </div>

        <!-- Campo Contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña (Mín. 6 caracteres)</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            :disabled="loading"
            class="w-full px-4 py-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="********"
          />
        </div>

        <!-- Botón de Registro -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span v-if="!loading">Registrarme</span>
          <span v-else>Creando cuenta...</span>
        </button>
        
        <!-- Enlace a Login -->
        <p class="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">Iniciar Sesión</NuxtLink>
        </p>
      </form>
      
      <!-- Mensaje de Error -->
      <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'default'
});

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

/**
 * Maneja el envío del formulario de registro.
 */
async function handleRegister() {
  if (!email.value || password.value.length < 6) {
    error.value = 'El email es requerido y la contraseña debe tener al menos 6 caracteres.';
    return;
  }
  
  loading.value = true;
  error.value = null;

  try {
    // Llama a la acción de registro del Store de Pinia
    await authStore.register(email.value, password.value);

    // Redirección en caso de éxito
    alert('¡Registro exitoso! Ya estás conectado.');
    await navigateTo('/', { replace: true });

  } catch (err: any) {
    if (err.code) {
      error.value = mapFirebaseError(err.code);
    } else {
      error.value = 'Ocurrió un error inesperado al registrar la cuenta.';
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
    case 'auth/email-already-in-use':
      return 'El email proporcionado ya está registrado.';
    case 'auth/invalid-email':
      return 'El formato del email es incorrecto.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    default:
      console.error(code);
      return 'Ocurrió un error inesperado al registrar. Inténtalo de nuevo.';
  }
}
</script>

<style scoped>
/* Estilos opcionales */
</style>