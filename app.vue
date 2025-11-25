<template>
  <div class="min-h-screen bg-gray-950 m-0 p-0">
    <NuxtPage />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Solo redirigir si estamos en la raíz "/"
if (process.client && route.path === '/') {
  router.replace('/login')
}
</script>

