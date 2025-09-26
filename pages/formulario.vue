<template>
  <button @click="$router.push('/menu')"
    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5">
    Volver a página principal
  </button>
  <main class="max-w-7xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-gray-300 mb-5">
    <h1 class="text-3xl font-semibold mb-6 text-gray-200">Crear Nuevo Formulario</h1>
    <div class="mb-6 flex space-x-4">
      <button type="button" @click="empresaId = 'A'" :class="[
        'px-4 py-2 rounded text-white transition',
        empresaId === 'A' ? 'bg-blue-600 shadow-lg' : 'bg-gray-700 hover:bg-gray-600'
      ]">
        BITNETS SPA
      </button>

      <button type="button" @click="empresaId = 'B'" :class="[
        'px-4 py-2 rounded text-white transition',
        empresaId === 'B' ? 'bg-green-600 shadow-lg' : 'bg-gray-700 hover:bg-gray-600'
      ]">
        BITNETS IP SPA
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- NUEVO: Selector de Cliente -->


      <div class="mb-6 bg-gray-800 p-4 rounded border border-gray-700 text-gray-200">
        <label for="clientSelect" class="block mb-1 font-medium">Seleccionar Cliente</label>
        <select id="clientSelect" v-model="selectedClientId" @change="onClientChange"
          class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200">
          <option value="">-- Selecciona un cliente --</option>
          <option v-for="clientes in clientes" :key="clientes.id" :value="clientes.id">
            {{ clientes.name }}
          </option>
        </select>
      </div>


      <!-- Nombre del formulario -->
      <div>
        <label for="formName" class="block text-gray-400 font-medium mb-2">Nombre del formulario</label>
        <input v-model="formName" id="formName" type="text" placeholder="Ej: Encuesta de satisfacción" required
          class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition text-gray-200" />
      </div>

      <div class="mb-6 bg-gray-800 p-4 rounded border border-gray-700 text-gray-200">
        <h2 class="text-lg font-semibold mb-4">Información de la empresa</h2>

        <div class="mb-4">
          <label for="companyName" class="block mb-1 font-medium">Nombre de la empresa/entidad</label>
          <input id="companyName" v-model="companyName" type="text" placeholder="Ej: ACME Ltda."
            class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" />
        </div>

        <div class="mb-4">
          <label for="attentionName" class="block mb-1 font-medium">Atención a</label>
          <input id="attentionName" v-model="attentionName" type="text" placeholder="Ej: Juan Pérez"
            class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" />
        </div>

        <div class="mb-4">
          <label for="emailName" class="block mb-1 font-medium">Email</label>
          <input id="emailName" v-model="emailName" type="text" placeholder="Ej: FME@gmail.com"
            class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" />
        </div>

        <div class="mb-4">
          <label for="contacName" class="block mb-1 font-medium">Contacto</label>
          <input id="contacName" v-model="contacName" type="text" placeholder="Ej: FME@gmail.com"
            class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" />
        </div>
      </div>


      <!-- Descripción general previa al formulario -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-200 mb-4">Secciones de Texto</h2>

        <div v-for="(textSection, index) in textSections" :key="index" class="mb-4 relative">
          <textarea v-model="textSection.content" rows="4" placeholder="Escribe aquí detalles o descripción"
            class="w-full rounded border border-gray-700 bg-gray-800 px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"></textarea>

          <button type="button" @click="removeTextSection(index)"
            class="absolute top-0 right-0 mt-1 mr-1 text-red-500 hover:text-red-700 font-bold text-xl"
            aria-label="Eliminar sección de texto">
            &times;
          </button>
        </div>

        <button type="button" @click="addTextSection"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200">
          + Agregar sección de texto
        </button>
      </div>



      <!-- Secciones dinámicas -->
      <div v-for="(section, sIndex) in sections" :key="sIndex" class="border border-gray-700 rounded p-4 mb-6">

        <!-- Título de la sección -->
        <div class="flex justify-between items-center mb-4">
          <input v-model="section.title" type="text" placeholder="Título de la sección"
            class="flex-grow rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
            required />
          <button type="button" @click="removeSection(sIndex)" class="ml-4 text-red-500 hover:text-red-700 font-bold"
            aria-label="Eliminar sección">
            &times;
          </button>
        </div>

        <!-- Campos de la sección con inputs -->
        <div v-for="(field, fIndex) in section.fields" :key="fIndex"
          class="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
          <!-- Nombre del producto -->
          <input v-model="field.label" type="text" placeholder="Nombre del producto"
            class="flex-grow rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 mb-2 md:mb-0"
            required />

          <!-- Cantidad con botones -->
          <div class="flex items-center space-x-2">

            <input v-model.number="field.quantity" type="number" min="1" placeholder="Cantidad"
              class="w-25 text-center rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
              required />

          </div>

          <!-- Unidad de medida -->
          <select v-model="field.unit"
            class="w-32 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2 md:mb-0">
            <option value="uds">Unidad</option>
            <option value="mts">Metro</option>
            <option value="lts">Litro</option>
            <option value="kg">Kg</option>
            <option value="otro">Otro</option>
          </select>



          <!-- Valor unitario -->
          <input v-model.number="field.unitPrice" type="number" min="0" step="0.01" placeholder="Valor unitario"
            class="w-40 rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 mb-2 md:mb-0"
            required />



          <!-- Total por producto -->
          <div class="ml-auto text-gray-300 font-semibold">
            Total: ${{ Math.round((Number(field.unitPrice) || 0) * (Number(field.quantity) || 0)) }}
          </div>

          <!-- Botón eliminar campo -->
          <button type="button" @click="removeField(sIndex, fIndex)"
            class="ml-4 text-red-500 hover:text-red-700 font-bold text-xl" aria-label="Eliminar producto">
            &times;
          </button>
        </div>

        <!-- Total de la sección alineado a la derecha -->
        <div class="flex justify-end font-semibold text-gray-300 mt-2">
          Total sección: ${{ Math.round(totalPorSeccion[sIndex] || 0) }}
        </div>

        <!-- Botón agregar campo -->
        <button type="button" @click="addField(sIndex)"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200">
          + Agregar producto
        </button>
      </div>



      <button type="button" @click="addSection"
        class="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded text-gray-200 font-semibold">
        + Agregar sección
      </button>

      <!-- Resumen de totales por sección -->
      <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6">
        <h2 class="text-lg font-semibold text-gray-200 mb-3">Total de servicio</h2>
        <ul class="space-y-2">
          <li v-for="(sectionTotal, index) in totalPorSeccion" :key="index" class="flex justify-between text-gray-300">
            <span>{{ sections[index].title || `Sección ${index + 1}` }}</span>
            <span>$ {{ Math.round(sectionTotal || 0) }}</span>
          </li>
        </ul>
        <div class="mt-4 text-right font-bold text-gray-100 text-lg border-t border-gray-600 pt-2">
          TOTAL NETO: ${{ Math.round(totalGeneral || 0) }}
        </div>
      </div>

      <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6">
        <h2 class="text-lg font-semibold text-gray-200 mb-3">Resumen Financiero</h2>
        <ul class="space-y-2 text-gray-300">
          <li class="flex justify-between items-center space-x-2">
            <span>Gastos SSO, adm y util</span>
            <input type="number" min="0" max="100" v-model.number="utilidadPorcentaje"
              class="w-16 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500" />
            <span>%</span>
            <span class="ml-auto">$ {{ Math.round(gastosSSO || 0) }}</span>
          </li>

          <li class="flex justify-between">
            <span>Neto</span>
            <span>$ {{ Math.round(neto || 0) }}</span>
          </li>
          <li class="flex justify-between">
            <span>IVA (19%)</span>
            <span>$ {{ Math.round(iva || 0) }}</span>
          </li>
          <li class="flex justify-between font-bold text-gray-100 border-t border-gray-600 pt-2">
            <span>TOTAL</span>
            <span>$ {{ Math.round(totalFinal || 0) }}</span>
          </li>
        </ul>
      </div>

      <label class="block mt-4">Linea de Firmante:</label>
      <input v-model="firmaTexto" id="firmaTexto" type="text" placeholder="Ejem: Bitnets SPA"
        class="border rounded px-2 py-1 w-full" />


      <div>
        <button type="submit"
          class="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-md transition">
          Guardar Formulario
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '~/firebase/firebase'
import { collection, getDocs, addDoc, serverTimestamp, query, limit, orderBy, where } from 'firebase/firestore'

const clientes = ref([])
const selectedClientId = ref('')
const empresaId = ref('A') // Valor inicial opcional, por ejemplo Empresa A


const companyName = ref('')
const attentionName = ref('')
const emailName = ref('')
const contacName = ref('')
const firmaTexto = ref('')

// 🔹 Mapa de conversión de unidades
const unitMap = {
  unidad: "uni",
  uni: "uni",
  uds: "uni",
  metro: "mts",
  metros: "mts",
  mts: "mts",
  litro: "lts",
  litros: "lts",
  lts: "lts",
  kilogramo: "kg",
  kilo: "kg",
  kilos: "kg",
  kg: "kg",
  otro: "otro"
}

async function loadClients() {
  try {
    const querySnapshot = await getDocs(collection(db, 'clientes'))
    clientes.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Clientes cargados:', clientes.value)
  } catch (error) {
    console.error('Error cargando clientes:', error)
  }
}

onMounted(loadClients)

function onClientChange() {
  const client = clientes.value.find(c => c.id === selectedClientId.value)
  if (client) {
    companyName.value = client.name || ''
    attentionName.value = client.contactPerson || ''
    emailName.value = client.email || ''
    contacName.value = client.phone || ''
  } else {
    companyName.value = ''
    attentionName.value = ''
    emailName.value = ''
    contacName.value = ''
  }
}


const formName = ref('')
const sections = ref([
  {
    title: '',
    fields: [{ label: '', unitPrice: 0, quantity: 1, type: 'text', unit: 'unidad' }]
  }
])

function addSection() {
  sections.value.push({
    title: '',
    fields: [{ label: '', unitPrice: 0, quantity: 1, type: 'text', unit: 'unidad' }]
  })
}

function removeSection(index) {
  sections.value.splice(index, 1)
}

function addField(sectionIndex) {
  sections.value[sectionIndex].fields.push({ label: '', unitPrice: 0, quantity: 1, type: 'text', unit: 'unidad' })
}

function removeField(sectionIndex, fieldIndex) {
  sections.value[sectionIndex].fields.splice(fieldIndex, 1)
}


async function generarNumeroCotizacion() {
  let q;
  if (empresaId.value === 'A') {
    // Empresa A: incluir docs con empresaId = 'A' o sin empresaId (históricas)
    q = query(collection(db, "formularios"));
  } else {
    // Empresa B: solo docs con empresaId = 'B'
    q = query(collection(db, "formularios"), where("empresaId", "==", "B"));
  }

  const snapshot = await getDocs(q);

  // Filtrar según empresa
  const docsFiltrados = snapshot.docs.filter(doc => {
    const data = doc.data();
    if (empresaId.value === 'A') {
      return !data.empresaId || data.empresaId === 'A';
    } else {
      return data.empresaId === 'B';
    }
  });

  // Ordenar por createdAt descendente, manejando string y Timestamp
  docsFiltrados.sort((a, b) => {
    const fechaA = a.data().createdAt?.toMillis?.() || new Date(a.data().createdAt).getTime() || 0;
    const fechaB = b.data().createdAt?.toMillis?.() || new Date(b.data().createdAt).getTime() || 0;
    return fechaB - fechaA; // más reciente primero
  });

  const ultimoId = docsFiltrados.length ? docsFiltrados[0].data().cotizacionId : 0;
  console.log("Cotización ID anterior recogida:", ultimoId); // ✅ Log agregado
  const nuevoId = ultimoId + 1;
  const version = "01";

  console.log("Docs totales:", snapshot.docs.length);
  console.log(`Docs filtrados por empresa ${empresaId.value}:`, docsFiltrados.length);
  console.log("Último cotizaciónId:", ultimoId, "Nuevo ID:", nuevoId);

  return { cotizacionId: nuevoId, version };
}



async function handleSubmit() {
  try {
    const formRef = collection(db, "formularios");
    const { cotizacionId, version } = await generarNumeroCotizacion();

    // 🔹 Normalizar unidades y calcular totales
    const preparedSections = sections.value.map(section => {
      let totalSection = 0;
      const productsWithTotal = section.fields.map(field => {
        const productTotal = (field.unitPrice || 0) * (field.quantity || 0);
        totalSection += productTotal;
        return {
          ...field,
          unit: unitMap[field.unit?.toLowerCase()] || field.unit, // ✅ normaliza
          total: productTotal
        };
      });
      return {
        title: section.title,
        fields: productsWithTotal,
        totalSection
      };
    });

    // Total general sumando totales de secciones
    const totalGeneralValue = preparedSections.reduce((acc, section) => acc + section.totalSection, 0);

    // Totales para resumen financiero
    const gastosSSOValue = totalGeneralValue * (utilidadPorcentaje.value / 100);
    const netoValue = totalGeneralValue + gastosSSOValue;
    const ivaValue = netoValue * 0.19;
    const totalFinalValue = netoValue + ivaValue;

    // Guardar en Firestore
    await addDoc(formRef, {
      empresaId: empresaId.value,
      name: formName.value,
      companyName: companyName.value || '',
      attentionName: attentionName.value || '',
      emailName: emailName.value || '',
      contacName: contacName.value || '',
      textSections: textSections.value || [],
      sections: preparedSections,
      totalPorSeccion: preparedSections.map(s => s.totalSection),
      totalGeneral: totalGeneralValue,
      utilidadPorcentaje: utilidadPorcentaje.value,
      resumenFinanciero: {
        gastosSSO: gastosSSOValue,
        neto: netoValue,
        iva: ivaValue,
        totalFinal: totalFinalValue
      },
      firmaTexto: firmaTexto.value,
      cotizacionId, // 5 dígitos
      version,      // "01"
      createdAt: serverTimestamp()
    });

    alert("Formulario guardado exitosamente ✅");

    // Resetear formulario
    formName.value = '';
    companyName.value = '';
    attentionName.value = '';
    textSections.value = [];
    sections.value = [
      {
        title: '',
        fields: [{ label: '', unitPrice: 0, quantity: 1 }]
      }
    ];
    utilidadPorcentaje.value = 20; // reset al valor inicial
  } catch (error) {
    console.error("Error al guardar el formulario:", error);
    alert("Hubo un error al guardar el formulario ❌");
  }
}



function increaseQuantity(sectionIndex, fieldIndex) {
  sections.value[sectionIndex].fields[fieldIndex].quantity++
}

function decreaseQuantity(sectionIndex, fieldIndex) {
  if (sections.value[sectionIndex].fields[fieldIndex].quantity > 1) {
    sections.value[sectionIndex].fields[fieldIndex].quantity--
  }
}

const totalPorSeccion = computed(() =>
  sections.value.map(section =>
    section.fields.reduce(
      (acc, field) => acc + (Number(field.unitPrice) || 0) * (Number(field.quantity) || 0),
      0
    )
  )
)

const totalGeneral = computed(() =>
  totalPorSeccion.value.reduce((acc, val) => acc + val, 0)
)
const utilidadPorcentaje = ref(20) // valor inicial 20%

const gastosSSO = computed(() => totalGeneral.value * (utilidadPorcentaje.value / 100))
const neto = computed(() => totalGeneral.value + gastosSSO.value)
const iva = computed(() => neto.value * 0.19)
const totalFinal = computed(() => neto.value + iva.value)


const textSections = ref([
  { content: '' }
])

function addTextSection() {
  textSections.value.push({ content: '' })
}

function removeTextSection(index) {
  textSections.value.splice(index, 1)
}




</script>

<style>
/* Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>