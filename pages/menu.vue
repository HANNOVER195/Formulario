<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-950 text-gray-200">
    <div class="bg-gray-900 rounded-lg shadow-lg p-10 w-full max-w-md space-y-6 text-center">
      <h1 class="text-3xl font-semibold mb-4">Menú Principal</h1>

      <NuxtLink
        to="/formulario"
        class="block w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 rounded-md transition font-medium"
      >
        Crear Formulario
      </NuxtLink>

      <NuxtLink
        to="/historial"
        class="block w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 rounded-md transition font-medium"
      >
        Ver Historial
      </NuxtLink>
      
      <NuxtLink
        to="/clientes"
        class="block w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 rounded-md transition font-medium"
      >
        Clientes
      </NuxtLink>
    </div>
  </main>
</template>
