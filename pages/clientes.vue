<template>
  <button
    @click="$router.push('/menu')"
    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"
  >
    Volver a página principal
  </button>

  <div class="min-h-screen flex items-center justify-center p-6">
    <!-- Contenedor principal -->
    <div class="bg-white shadow-xl rounded-2xl w-full max-w-6xl h-[80vh] flex overflow-hidden border border-gray-200">

      <!-- Sidebar: Lista de clientes -->
      <div class="w-1/3 border-r border-black bg-gray-200 text-black flex flex-col">
        <h2 class="p-4 font-bold text-lg border-b border-gray-800">Clientes</h2>
        <ul class="overflow-y-auto flex-1">
          <li
            v-for="cliente in clientes"
            :key="cliente.id"
            @click="seleccionarCliente(cliente)"
            class="p-3 cursor-pointer hover:bg-[#133b66] transition"
            :class="selectedCliente?.id === cliente.id ? 'bg-[#133b66] font-semibold text-white' : ''"
          >
            <p>{{ cliente.name }}</p>
            <p class="text-sm text-gray-800">{{ cliente.contactPerson }}</p>
          </li>
        </ul>

        <!-- Botón crear nuevo cliente 
        <div class="p-3 border-t border-gray-800">
          <button
            @click="abrirCreacion"
            class="w-full bg-blue-800 text-white py-2 px-3 rounded hover:bg-blue-900 transition"
            >
            + Nuevo cliente
            </button>


        </div> -->
      </div>

      <!-- Panel derecho: Detalle del cliente -->
        <div class="flex-1 p-8 bg-gray-800 relative">
        <div v-if="selectedCliente" class="h-full flex flex-col">
            <!-- Información del cliente -->
            <div>
            <h2 class="text-2xl font-bold text-gray-300 mb-4">{{ selectedCliente.name }}</h2>
            <div class="space-y-2 text-gray-200">
                <p><span class="font-semibold">Contacto:</span> {{ selectedCliente.contactPerson }}</p>
                <p><span class="font-semibold">Email:</span> {{ selectedCliente.email }}</p>
                <p><span class="font-semibold">Teléfono:</span> {{ selectedCliente.phone }}</p>
            </div>

            <!-- Botón editar -->
            <button
                class="mt-6 bg-[#0a2540] text-white px-5 py-2 rounded-xl hover:bg-[#133b66] transition"
                @click="modoEdicion = !modoEdicion"
            >
                {{ modoEdicion ? 'Cancelar' : 'Editar' }}
            </button>

            <!-- Formulario de edición -->
            <div v-if="modoEdicion" class="mt-6 space-y-3">
                <input v-model="form.name" class="border p-2 w-full rounded-lg text-white" placeholder="Nombre empresa" />
                <input v-model="form.contactPerson" class="border p-2 w-full rounded-lg text-white" placeholder="Persona de contacto" />
                <input v-model="form.email" class="border p-2 w-full rounded-lg text-white" placeholder="Email" />
                <input v-model="form.phone" class="border p-2 w-full rounded-lg text-white" placeholder="Teléfono" />

                <button
                class="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                @click="guardarCambios"
                >
                Guardar cambios
                </button>
            </div>
            </div>

            <!-- Formulario para crear cliente -->
            <div v-if="modoCreacion" class="space-y-3">
            <h2 class="text-2xl font-bold text-gray-300 mb-4">Crear nuevo cliente</h2>
            <input v-model="form.name" class="border p-2 w-full rounded-lg text-white" placeholder="Nombre empresa" />
            <input v-model="form.contactPerson" class="border p-2 w-full rounded-lg text-white" placeholder="Persona de contacto" />
            <input v-model="form.email" class="border p-2 w-full rounded-lg text-white" placeholder="Email" />
            <input v-model="form.phone" class="border p-2 w-full rounded-lg text-white" placeholder="Teléfono" />


            </div>


            <!-- Espaciador flexible para empujar el botón de borrar hacia abajo -->
            <div class="flex-1"></div>

            <!-- Botón borrar cliente (si NO estamos en modo edición) -->
            <div v-if="!modoEdicion" class="flex justify-end">
            <button
                class="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition"
                @click="borrarCliente"
            >
                Borrar cliente
            </button>
            </div>
        </div>

        <!-- Modal de confirmación -->
        <div v-if="modalBorrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 class="text-lg font-bold mb-4">Seguro de borrar a este cliente?</h3>
            <p class="mb-6 text-gray-700">{{ selectedCliente.name }}</p>
            <div class="flex justify-end space-x-4">
            <button
                class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                @click="modalBorrar = false"
            >
                Cancelar
            </button>
            <button
                class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                @click="confirmarBorrarCliente"
            >
                Borrar
            </button>
                <!-- Modal de confirmación -->
                <div v-if="modalBorrar" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div
                    class="bg-[#0a2540] text-white rounded-xl p-6 w-96 shadow-lg pointer-events-auto"
                >
                    <h3 class="text-lg font-bold mb-4">Seguro de borrar a este cliente?</h3>
                    <p class="mb-6">{{ selectedCliente.name }}</p>
                    <div class="flex justify-end space-x-4">
                    <button
                        class="px-4 py-2 rounded-lg bg-gray-300 text-black hover:bg-gray-400 transition"
                        @click="modalBorrar = false"
                    >
                        Cancelar
                    </button>
                    <button
                        class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                        @click="confirmarBorrarCliente"
                    >
                        Borrar
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </div>
        <!-- Mensaje cuando no hay selección -->
        <div v-else class="text-gray-500 flex items-center justify-center h-full">
            Selecciona un cliente en la lista para ver los detalles
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore"
import { db } from '~/firebase/firebase'

const clientes = ref([])
const selectedCliente = ref(null)
const modoEdicion = ref(false)
const modoCreacion = ref(false)
const form = ref({ name: '', contactPerson: '', email: '', phone: '' })
const modalBorrar = ref(false)

// Cargar clientes
onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "clientes"))
  clientes.value = querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }))
})

// Seleccionar cliente
const seleccionarCliente = (cliente) => {
  selectedCliente.value = cliente
  form.value = { ...cliente }
  modoEdicion.value = false
  modoCreacion.value = false
}

// Abrir formulario de creación
const abrirCreacion = () => {
  modoCreacion.value = true
  selectedCliente.value = null
  form.value = { name: '', contactPerson: '', email: '', phone: '' }
}

// Guardar cambios en cliente existente
const guardarCambios = async () => {
  if (!selectedCliente.value) return
  try {
    const clienteRef = doc(db, "clientes", selectedCliente.value.id)
    await updateDoc(clienteRef, {
      name: form.value.name,
      contactPerson: form.value.contactPerson,
      email: form.value.email,
      phone: form.value.phone
    })
    Object.assign(selectedCliente.value, form.value)
    modoEdicion.value = false
    alert("Cliente actualizado correctamente ✅")
  } catch (err) {
    console.error("Error al actualizar:", err)
    alert("Error al actualizar cliente ❌")
  }
}

// Crear nuevo cliente
const crearCliente = async () => {
  try {
    const clienteRef = await addDoc(collection(db, "clientes"), {
      ...form.value,
      createdAt: serverTimestamp()
    })
    const nuevoCliente = { id: clienteRef.id, ...form.value }
    clientes.value.push(nuevoCliente)
    modoCreacion.value = false
    selectedCliente.value = nuevoCliente
    alert("Cliente creado correctamente ✅")
  } catch (err) {
    console.error("Error al crear cliente:", err)
    alert("Error al crear cliente ❌")
  }
}

// Abrir modal de borrar
const borrarCliente = () => {
  if (!selectedCliente.value) return
  modalBorrar.value = true
}

// Confirmar borrado
const confirmarBorrarCliente = async () => {
  if (!selectedCliente.value) return
  try {
    const clienteRef = doc(db, "clientes", selectedCliente.value.id)
    await deleteDoc(clienteRef)
    clientes.value = clientes.value.filter(c => c.id !== selectedCliente.value.id)
    selectedCliente.value = null
    modalBorrar.value = false
    alert("Cliente borrado correctamente ✅")
  } catch (err) {
    console.error("Error al borrar:", err)
    alert("Hubo un error al borrar el cliente ❌")
  }
}

const crearNuevoClienteSeleccionado = () => {
  selectedCliente.value = { esNuevo: true };
  form.value = { name: '', contactPerson: '', email: '', phone: '' };
  modoEdicion.value = false;
};

</script>
