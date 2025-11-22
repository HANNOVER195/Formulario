<template>
  <button
    @click="$router.push('/menu')"
    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"
  >
    Volver a página principal
  </button>

  <main class="max-w-3xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-gray-300 mb-5">
    <h1 class="text-3xl font-semibold mb-6 text-gray-200">Crear Nuevo Cliente</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="clientName" class="block text-gray-400 font-medium mb-2">Nombre del Cliente</label>
        <input
          v-model="clientName"
          id="clientName"
          type="text"
          placeholder="Ej: ACME Ltda."
          required
          class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
        />
      </div>

      <div>
        <label for="contactPerson" class="block text-gray-400 font-medium mb-2">Contacto Principal</label>
        <input
          v-model="contactPerson"
          id="contactPerson"
          type="text"
          placeholder="Ej: Juan Pérez"
          class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
        />
      </div>

      <div>
        <label for="email" class="block text-gray-400 font-medium mb-2">Correo Electrónico</label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="ejemplo@correo.com"
          class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
        />
      </div>

      <div>
        <label for="phone" class="block text-gray-400 font-medium mb-2">Teléfono</label>
        <input
          v-model="phone"
          id="phone"
          type="tel"
          placeholder="+56 9 1234 5678"
          class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
        />
      </div>

      <div>
        <label for="rut" class="block text-gray-400 font-medium mb-2">RUT</label>
        <input
          v-model="rut"
          id="rut"
          type="tel"
          placeholder="20.256.254-0"
          class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
        />
      </div>

      <div>
        <button
          type="submit"
          class="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-md transition"
        >
          Guardar Cliente
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '~/firebase/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const clientName = ref('')
const contactPerson = ref('')
const email = ref('')
const phone = ref('')
const rut = ref('')

async function handleSubmit() {
  try {
    if (!clientName.value) {
      alert('El nombre del cliente es obligatorio')
      return
    }

    const clientsRef = collection(db, 'clientes')

    await addDoc(clientsRef, {
      name: clientName.value,
      contactPerson: contactPerson.value,
      email: email.value,
      phone: phone.value,
      rut: rut.value,
      createdAt: serverTimestamp()
    })

    alert('Cliente guardado exitosamente ✅')

    clientName.value = ''
    contactPerson.value = ''
    email.value = ''
    phone.value = ''
    rut.value = ''
  } catch (error) {
    console.error('Error guardando cliente:', error)
    alert('Error guardando cliente ❌')
  }
}
</script>
