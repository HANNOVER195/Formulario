<template>
  <div>
    <button @click="$router.push('/historial')" class="bg-red-600 text-white p-2 rounded">
      Volver al historial
    </button>

    <div v-if="cargando">Cargando formulario...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h2>Formulario: {{ formulario.name }}</h2>
      <button @click="editar(formulario.id)" class="bg-blue-600 text-white p-2 rounded">
        Editar
      </button>
      <!-- Aquí puedes seguir mostrando los datos del formulario -->
      <p>Empresa: {{ formulario.companyName }}</p>
      <p>Atención a: {{ formulario.attentionName }}</p>
      <p>Email: {{ formulario.emailName }}</p>
      <p>Teléfono: {{ formulario.contacName }}</p>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '~/firebase/firebase'

const route = useRoute()
const formulario = ref(null)
const cargando = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const id = route.params.id
    const docRef = doc(db, 'formularios', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      formulario.value = { id: docSnap.id, ...docSnap.data() }
    } else {
      error.value = 'Formulario no encontrado'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Error al cargar el formulario'
  } finally {
    cargando.value = false
  }
})

const editar = (id) => {
  console.log('Antes de redirigir, id:', id)
  // Para Nuxt 3 + Vue Router
  window.location.href = `/verformulario/${id}/editar`
  console.log('Después de router push')
}
</script>
