<template>
  <button
    @click="$router.push('/menu')"
    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition m-5"
  >
    Volver a página principal
  </button>

  <main class="max-w-3xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-gray-300 min-h-[400px]">
    <h1 class="text-3xl font-semibold mb-6 text-gray-200 text-center">Historial de Formularios</h1>

    <div v-if="loading" class="text-center text-gray-400">Cargando formularios...</div>

    <div v-else-if="formularios.length === 0" class="text-center text-gray-400">
      No hay historiales disponibles por ahora.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="form in formularios"
        :key="form.id"
        class="border border-gray-700 bg-gray-800 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
        @click="verFormulario(form.id)"
      >
        <h2 class="text-xl font-bold text-gray-100">{{ form.name }}</h2>
        <p class="text-sm text-gray-400">Fecha: {{ formatDate(form.createdAt) }}</p>
        <p class="text-md font-semibold text-green-300 mt-2">
          Total Final: ${{ form.resumenFinanciero?.totalFinal ? Math.round(form.resumenFinanciero.totalFinal) : 0 }}
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '~/firebase/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const formularios = ref([])
const loading = ref(true)

function formatDate(timestamp) {
  if (!timestamp?.toDate) return 'Fecha desconocida'
  const date = timestamp.toDate()
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function verFormulario(id) {
  router.push(`/verformulario/${id}`)
}

onMounted(async () => {
  try {
    const q = query(collection(db, 'formularios'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    formularios.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    console.error('Error al cargar formularios:', err)
  } finally {
    loading.value = false
  }
})
</script>
