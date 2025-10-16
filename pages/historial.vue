<template>
  <!-- Botón para volver al menú principal -->
  <button @click="$router.push('/menu')"
    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition m-5">
    Volver a página principal
  </button>

  <!-- Contenedor principal del historial -->
  <main class="max-w-5xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-gray-300 min-h-[400px]">
    <!-- Título de la página -->
    <h1 class="text-3xl font-semibold mb-6 text-gray-200 text-center">
      Historial de Formularios
    </h1>

    <!-- Botones para seleccionar empresa -->
    <div class="flex justify-center gap-4 mb-6">
      <!-- Botón para cargar formularios de BITNETS SPA -->
      <button @click="cargarFormularios('A')" :class="[
        'px-4 py-2 rounded font-semibold transition',
        selectedEmpresa === 'empresaA'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      ]">
        BITNETS SPA
      </button>

      <!-- Botón para cargar formularios de BITNETS IP SPA -->
      <button @click="cargarFormularios('B')" :class="[
        'px-4 py-2 rounded font-semibold transition',
        selectedEmpresa === 'empresaB'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      ]">
        BITNETS IP SPA
      </button>
    </div>

    <!-- Mensaje mostrado mientras se cargan los formularios -->
    <div v-if="loading" class="text-center text-gray-400">
      Cargando formularios...
    </div>

    <!-- Mensaje cuando no hay formularios disponibles -->
    <div v-else-if="formularios.length === 0" class="text-center text-gray-400">
      No hay historiales disponibles por ahora.
    </div>

    <!-- Lista de formularios disponibles -->
    <div v-else class="space-y-4">
      <div v-for="form in formularios" :key="form.id" class="relative flex items-center">

        <!-- Tarjeta como botón gigante -->
        <div class="border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer flex-1"
          :class="form.estadoFacturaSW ? 'bg-green-900 border-green-800' : 'bg-gray-800 border-gray-700'"
          @click="verFormulario(form.id)">
          <div class="flex justify-between">
            <!-- Izquierda: datos principales -->
            <div class="flex-1 pr-4">
              <h2 class="text-xl font-bold text-gray-100">{{ form.name }}</h2>
              <p class="text-sm text-gray-400">Nº de Cotización: {{ form.cotizacionId || 'Sin número' }}</p>
              <p class="text-sm text-gray-400">Fecha: {{ formatDate(form.createdAt) }}</p>
              <p class="text-md font-semibold text-green-300 mt-2">
                Total Final: ${{ form.resumenFinanciero?.totalFinal ? Math.round(form.resumenFinanciero.totalFinal) : 0
                }}
              </p>
            </div>

            <!-- Derecha: otros datos -->
            <div class="flex-1 text-right pl-4">
              <h2 class="text-xl font-bold text-gray-100">Orden de Compra: {{ form.ordenDeCompra }}</h2>
              <p class="text-sm text-gray-400">Factura: {{ form.factura }}</p>
              <p class="text-sm text-gray-400">Fecha de Factura: {{ form.fechaFactura }}</p>
            </div>
          </div>
        </div>

        <!-- Switch fuera de la tarjeta -->
        <label class="ml-4 relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="form.estadoFacturaSW" class="sr-only peer"
            @change="actualizarEstado(form.id, form.estadoFacturaSW)">
          <div class="w-10 h-5 bg-gray-600 rounded-full peer-checked:bg-green-500 transition-colors"></div>
          <div
            class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform peer-checked:translate-x-5">
          </div>

        </label>
      </div>
    </div>


  </main>
</template>

<script setup>
// Importa ref para variables reactivas
import { ref, reactive } from 'vue'

// Importa funciones de Firestore para consultas
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore'

// Importa la instancia de la base de datos
import { db } from '~/firebase/firebase'

// Importa el hook para manejar rutas
import { useRouter } from 'vue-router'

// Inicializa el enrutador
const router = useRouter()

// Lista reactiva de formularios
const formularios = ref([])

// Indicador de carga
const loading = ref(false)

// Empresa seleccionada actualmente
const selectedEmpresa = ref(null)

// Formatea una marca de tiempo en formato local chileno
function formatDate(timestamp) {
  if (!timestamp?.toDate) return 'Fecha desconocida'
  const date = timestamp.toDate()
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Redirige al detalle del formulario seleccionado
function verFormulario(id) {
  router.push(`/verformulario/${id}`)
}

// Carga los formularios según la empresa seleccionada
async function cargarFormularios(empresa) {
  loading.value = true
  try {
    // Obtiene todos los documentos
    const snap = await getDocs(collection(db, 'formularios'))

    // Mapear docs y agregar estado del switch
    const allDocs = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      estadoFacturaSW: doc.data().estadoFacturaSW ?? false // por defecto false
    }))

    // Filtrado por empresa
    let filtered = []
    if (empresa === 'A') {
      filtered = allDocs.filter(f => !f.empresaId || f.empresaId === 'A')
    } else if (empresa === 'B') {
      filtered = allDocs.filter(f => f.empresaId === 'B')
    }

    // Separar con y sin cotizacion
    const conCotizacion = filtered
      .filter(f => typeof f.cotizacionId !== 'undefined')
      .sort((a, b) => b.cotizacionId - a.cotizacionId) // descendente
    const sinCotizacion = filtered
      .filter(f => typeof f.cotizacionId === 'undefined')

    // Combinar y asignar a la lista reactiva
    formularios.value = [...conCotizacion, ...sinCotizacion]

    // Guardar empresa seleccionada
    selectedEmpresa.value = empresa
  } catch (err) {
    console.error('Error al cargar formularios:', err)
  } finally {
    loading.value = false
  }
}



// Función para actualizar estado en Firestore
async function actualizarEstado(formId, nuevoEstado) {
  try {
    const formRef = doc(db, 'formularios', formId)
    await updateDoc(formRef, { estadoFacturaSW: nuevoEstado })
    console.log('Estado actualizado:', nuevoEstado)
  } catch (error) {
    console.error('Error actualizando estado:', error)
  }
}


</script>
