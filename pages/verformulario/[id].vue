<template>
  <button @click="$router.push('/historial')"
    class="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded transition m-5">
    Volver al historial
  </button>


  <button @click="modoEdicion = true"
    class="bg-yellow-600 hover:bg-yellow-800 text-white font-semibold py-2 px-4 rounded transition m-5">
    Editar
  </button>

  <button @click="eliminarFormulario"
    class="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded transition m-5">
    🗑️ Eliminar Formulario
  </button>



  <main ref="contentToPrint" class="max-w-5xl mx-auto p-6 rounded-lg shadow-lg"
    :style="{ backgroundColor: '#1a202c', color: '#e2e8f0' }">
    <h1 class="text-3xl font-bold mb-4 text-gray-200">{{ formulario?.name || 'Formulario' }}</h1>

    <!-- Información general -->
    <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6 text-sm text-gray-300">
      <p><strong>Empresa:</strong> {{ formulario?.companyName || '-' }}</p>
      <p><strong>Atención a:</strong> {{ formulario?.attentionName || '-' }}</p>
      <p><strong>Email:</strong> {{ formulario?.emailName || '-' }}</p>
      <p><strong>Teléfono:</strong> {{ formulario?.contacName || '-' }}</p>
      <p><strong>RUT:</strong> {{ formulario?.rutName || '-' }}</p>
      <p><strong>Fecha de creación:</strong> {{ formatDate(formulario?.createdAt) }}</p>
    </div>

    <div v-if="formulario">

      <!-- Descripciones generales -->
      <div v-if="formulario.descripcion || formulario.detalles"
        class="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-100 mb-2">Detalles del formulario</h2>
        <p v-if="formulario.descripcion" class="mb-2"><strong>Descripción:</strong> {{ formulario.descripcion }}</p>
        <p v-if="formulario.detalles"><strong>Detalles de actividades:</strong> {{ formulario.detalles }}</p>
      </div>

      <!-- TextSections -->
      <div v-if="formulario.textSections?.length" class="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-100 mb-2">Secciones Descriptivas</h2>
        <div v-for="(text, index) in formulario.textSections" :key="index" class="mb-2">
          <p class="text-gray-300">📌 {{ text.content }}</p>
        </div>
      </div>
      <!-- Secciones de productos -->
      <div v-for="(section, index) in formulario.sections" :key="index" class="border border-gray-700 rounded p-4 mb-6">
        <h2 class="text-xl font-semibold text-gray-100 mb-3">{{ section.title || `ITEM ${index + 1}` }}</h2>
        <table class="w-full text-left text-gray-300 mb-3">
          <thead>
            <tr class="border-b border-gray-600">
              <th class="py-2">Producto</th>
              <th class="py-2">Cantidad</th>
              <th class="py-2">Unidad</th>
              <th class="py-2">Valor Unitario</th>
              <th class="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(field, idx) in section.fields" :key="idx" class="border-t border-gray-800">
              <td class="py-2">{{ field.label }}</td>
              <td class="py-2">{{ field.quantity }}</td>
              <td class="py-2">{{ field.unit }}</td>
              <td class="py-2">$ {{ formatNumber(field.unitPrice) }}</td>
              <td class="py-2">$ {{ formatNumber(field.total) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-right font-semibold text-gray-200">
          Total sección: ${{ formatNumber(section.totalSection) }}
        </div>
      </div>

      <!-- Total por sección -->
      <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-100 mb-3">Total de servicio</h2>
        <ul class="text-gray-300 space-y-1">
          <li v-for="(total, index) in formulario.totalPorSeccion" :key="index" class="flex justify-between">
            <span>{{ formulario.sections[index]?.title || `Sección ${index + 1}` }}</span>
            <span>$ {{ formatNumber(total) }}</span>
          </li>
        </ul>
        <div class="mt-2 text-right font-bold text-lg text-gray-100 border-t border-gray-600 pt-2">
          SUBTOTALES: ${{ formatNumber(formulario.totalGeneral) }}
        </div>
      </div>

      <!-- Resumen financiero -->
      <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-100 mb-3">Resumen Financiero</h2>
        <ul class="text-gray-300 space-y-1">
          <li class="flex justify-between">
            <span>Gastos SSO, adm y util {{ formulario.utilidadPorcentaje || 20 }}%</span>
            <span>$ {{ formatNumber(formulario.resumenFinanciero?.gastosSSO) }}</span>
          </li>
          <li class="flex justify-between"><span>Neto</span><span>$ {{ formatNumber(formulario.resumenFinanciero?.neto)
              }}</span></li>
          <li class="flex justify-between"><span>IVA (19%)</span><span>$ {{
            formatNumber(formulario.resumenFinanciero?.iva) }}</span></li>
          <li class="flex justify-between font-bold border-t border-gray-600 pt-2 text-gray-100">
            <span>TOTAL</span><span>$ {{ formatNumber(formulario.resumenFinanciero?.totalFinal) }}</span>
          </li>
        </ul>
      </div>
      <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
        <p><strong>Firma:</strong> {{ formulario?.firmaTexto || '-' }}</p>
      </div>
    </div>



    <div v-else class="text-center text-gray-400">Cargando información...</div>


    <!-- AREA DE EDICION DE PAGINA -->

    <div v-if="modoEdicion"
      class="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-auto">
      <div class="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <!-- Inputs -->
        <!-- Información general -->
        <!-- Nuevos campos: Orden de compra, Factura y Fecha de Factura -->
        <label class="block mt-2">Orden de compra:</label>
        <input v-model="formEditable.ordenDeCompra" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <label class="block mt-2">Factura:</label>
        <input v-model="formEditable.factura" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <label class="block mt-2">Fecha de factura:</label>
        <input v-model="formEditable.fechaFactura" type="date"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <!-- Campo para el nombre del formulario -->
        <label class="block mt-2">Nombre del formulario:</label>
        <input v-model="formEditable.name" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />


        <label class="block mt-2">Empresa:</label>
        <input v-model="formEditable.companyName" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />


        <label class="block mt-2">Atención a:</label>
        <input v-model="formEditable.attentionName" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <label class="block mt-2">Email:</label>
        <input v-model="formEditable.emailName" type="email"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <label class="block mt-2">Teléfono:</label>
        <input v-model="formEditable.contacName" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <label class="block mt-2">RUT:</label>
        <input v-model="formEditable.rutName" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />





        <!-- Secciones descriptivas -->
        <!-- Renderizar las secciones descriptivas -->
        <div v-for="(section, index) in formEditable.textSections" :key="index" class="mt-2">
          <label class="block text-sm text-gray-400 mb-1">Sección {{ index + 1 }}</label>
          <textarea v-model="section.content"
            class="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
            rows="3"></textarea>
        </div>

        <div class="mt-4 flex justify-between">
          <button type="button" @click="addTextSection()"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200">
            + Agregar Sección Descriptiva
          </button>
          <button type="button" @click="removeLastTextSection()"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
            ✕ Eliminar Última Sección Descriptiva
          </button>
        </div>


        <!-- Secciones con productos -->
        <div v-for="(section, sIndex) in formEditable.sections" :key="'section-' + sIndex"
          class="mt-4 border-t border-gray-600 pt-4">

          <label class="block font-semibold">Sección {{ sIndex + 1 }}: {{ section.title }}</label>
          <input v-model="section.title" type="text"
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 mb-2" />

          <!-- Encabezados de la tabla -->
          <div class="grid grid-cols-8 gap-2 mb-1 text-gray-400 font-semibold text-sm">
            <div class="col-span-4">Producto</div>
            <div>Cantidad</div>
            <div>Unidad</div>
            <div>Valor Unitario</div>
            <div>Total</div>
          </div>

          <!-- Campos de productos -->
          <div v-for="(field, fIndex) in section.fields" :key="'field-' + fIndex" class="grid grid-cols-8 gap-2 mb-2">
            <!-- Producto ocupa 2 columnas -->
            <input v-model="field.label" type="text" placeholder="Producto"
              class="col-span-4 p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

            <!-- Cantidad -->
            <input v-model.number="field.quantity" @input="recalcularTotales(section)" type="number"
              class="p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

            <!-- Unidad -->
            <input v-model="field.unit" type="text" placeholder="Unidad"
              class="p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

            <!-- Valor Unitario -->
            <input v-model.number="field.unitPrice" @input="recalcularTotales(section)" type="number"
              class="p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

            <!-- Total: ocupar 1 columna -->
            <input :value="field.quantity * field.unitPrice" type="text" readonly
              class="p-2 rounded border bg-gray-900 text-gray-200 font-semibold text-right" />
          </div>


          <!-- Botones Agregar / Eliminar producto -->
          <div class="mt-2 flex justify-between">
            <button type="button" @click="addField(sIndex)"
              class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-200">
              + Agregar producto
            </button>

            <button type="button" @click="removeLastField(sIndex)"
              class="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white">
              ✕
            </button>
          </div>

          <div class="text-right font-bold mt-1">
            Total Sección: {{ section.totalSection }}
          </div>
        </div>



        <!-- Botones Agregar / Eliminar Sección -->
        <div class="mt-4 flex justify-between">
          <button type="button" @click="addSection()"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200">
            + Agregar Sección
          </button>

          <button type="button" @click="removeLastSection()"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
            ✕ Eliminar Última Sección
          </button>
        </div>


        <!-- Totales -->
        <label class="block mt-2">Total por sección (array):</label>
        <div v-for="(total, index) in totalPorSeccion" :key="index">
          <input type="text" :value="total" readonly
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 mb-2" />
        </div>

        <label class="block mt-2">Total general:</label>
        <input v-model="formEditable.totalGeneral" type="number" readonly
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <label class="block mt-2">Porcentaje de utilidad:</label>
        <input v-model="formEditable.utilidadPorcentaje" type="number"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <!-- Resumen financiero -->
        <div class="mt-4 border-t border-gray-600 pt-4">
          <label class="block mt-2">Gastos SSO:</label>
          <input :value="formatNumber(formEditable.resumenFinanciero.gastosSSO)" type="text" readonly
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

          <label class="block mt-2">Neto:</label>
          <input :value="formatNumber(formEditable.resumenFinanciero.neto)" type="text" readonly
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

          <label class="block mt-2">IVA:</label>
          <input :value="formatNumber(formEditable.resumenFinanciero.iva)" type="text" readonly
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

          <label class="block mt-2">Total final:</label>
          <input :value="formatNumber(formEditable.resumenFinanciero.totalFinal)" type="text" readonly
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />
        </div>


        <label class="block mt-2">Firma:</label>
        <input v-model="formEditable.firmaTexto" type="text"
          class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200" />

        <!-- Botones de acción -->
        <div class="flex justify-end gap-2 mt-4">
          <button @click="modoEdicion = false"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Cancelar</button>
          <button @click="guardarCambios()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>





  </main>

  <!-- Botón para exportar PDF -->
  <div class="max-w-5xl mx-auto p-6 flex justify-end">
    <button @click="exportPDF" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      :disabled="!formulario">
      Exportar a PDF
    </button>
  </div>









</template>


<script setup>
definePageMeta({
  ssr: false
})



import { useRoute } from 'vue-router'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '~/firebase/firebase'

const route = useRoute()

function formatNumber(value) {
  if (value == null || isNaN(value)) return '0'
  return Number(value).toLocaleString('es-CL', { maximumFractionDigits: 0 })
}
function sanitizeFormulario(data) {
  const toISO = (ts) => (ts?.toDate ? ts.toDate().toISOString() : ts ?? null)

  return {
    ...data,
    // Mantener los nombres que estás usando en el formulario / DB
    companyName: data.companyName ?? '',
    attentionName: data.attentionName ?? '',
    emailName: data.emailName ?? '',   // <-- usar el mismo nombre que guardas
    contacName: data.contacName ?? '', // <-- idem (phone quedó guardado como contacName)
    rutName: data.rutName ?? '',
    createdAt: toISO(data.createdAt),
    descripcion: data.descripcion ?? '',
    detalles: data.detalles ?? '',
    textSections: data.textSections?.map(section => ({
      content: section.content ?? ''
    })) ?? [],
    sections: data.sections?.map(section => ({
      title: section.title ?? '',
      totalSection: section.totalSection ?? 0,
      fields: section.fields?.map(field => ({
        label: field.label ?? '',
        unit: field.unit ?? '',
        unitPrice: field.unitPrice ?? 0,
        quantity: field.quantity ?? 0,
        get total() {
          return (Number(this.unitPrice) || 0) * (Number(this.quantity) || 0)
        }
      })) ?? []
    })) ?? [],
    totalPorSeccion: data.totalPorSeccion ?? [],
    totalGeneral: data.totalGeneral ?? 0,
    utilidadPorcentaje: data.utilidadPorcentaje ?? 20,  // <-- lo lees directo de data
    resumenFinanciero: {
      gastosSSO: data.resumenFinanciero?.gastosSSO ?? 0,
      neto: data.resumenFinanciero?.neto ?? 0,
      iva: data.resumenFinanciero?.iva ?? 0,
      totalFinal: data.resumenFinanciero?.totalFinal ?? 0,
      fechaPago: toISO(data.resumenFinanciero?.fechaPago)
    },
    firmaTexto: data.firmaTexto ?? '',
    ordenCompra: data.ordenCompra ?? '',
    factura: data.factura ?? '',
    fechaFactura: toISO(data.fechaFactura),
  }
}


async function loadImageAsBase64(path) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = path
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
  })
}


const { data: formulario, error } = await useAsyncData(`formulario-${route.params.id}`, async () => {
  const docRef = doc(db, 'formularios', route.params.id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    throw createError({ statusCode: 404, statusMessage: 'Formulario no encontrado' })
  }

  const rawData = docSnap.data()
  return sanitizeFormulario(rawData)
})




async function exportPDF() {
  const [{ jsPDF }, autoTable] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable').then(m => m.default || m)
  ])

  const doc = new jsPDF()
  const marginLeft = 10
  let currentY = 5


  const logoBase64 = await loadImageAsBase64('/BitnetsLogo.jpg')
  const logoBase64IP = await loadImageAsBase64('/BitnestIpLogo.png')


  // Título principal
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  if (formulario.value.empresaId === 'B') {
    doc.text('BITNETS IP SPA', marginLeft, currentY)
  } else {
    doc.text('BITNETS SPA', marginLeft, currentY)
  }

  // Logo a la derecha (usar imagen en Base64 o data:image/png;base64,...)
  // Ajusta las coordenadas y tamaño según tu logo
  doc.addImage(logoBase64, 'PNG', 160, currentY - 1, 30, 10)
  if (formulario.value.empresaId === 'B') {
    doc.addImage(logoBase64IP, 'PNG', 160, currentY - 1, 30, 12)
  } else {
    doc.addImage(logoBase64, 'PNG', 160, currentY - 1, 30, 10)
  }
  currentY += 4

  // Subtítulo o detalles
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  if (formulario.value.empresaId === 'B') {
    doc.text('Servicios Informáticos', marginLeft, currentY)
  } else {
    doc.text('Servicios Integrales en Tecnología', marginLeft, currentY)
  }
  currentY += 3
  if (formulario.value.empresaId === 'B') {
    doc.text('RUT: 78.217.083-K', marginLeft, currentY)
  } else {
    doc.text('RUT: 76.504.212-7', marginLeft, currentY)
  }
  currentY += 3
  if (formulario.value.empresaId === 'B') {
    doc.text('El Mañio Parcela 7E Lagunitas, PUERTO MONTT', marginLeft, currentY)
  } else {
    doc.text('Caulin s/n - ANCUD', marginLeft, currentY)
  }
  currentY += 3

  // Línea divisoria
  doc.setLineWidth(0.5)
  doc.line(marginLeft, currentY, 190, currentY)

  currentY += 10


  // Título principal
  doc.setFontSize(12)
  doc.text(formulario.value.name || 'Formulario', marginLeft, currentY)
  currentY += 10

  // Datos generales
  doc.setFontSize(8)

  if (!formulario.value.empresaId || formulario.value.empresaId === 'A') {
    // 🔹 Condicionales de Empresa A
    if (formulario.value.companyName) {
      doc.text(`Empresa: ${formulario.value.companyName}`, marginLeft, currentY)
      currentY += 3
    }
    if (formulario.value.attentionName) {
      doc.text(`Atención: ${formulario.value.attentionName}`, marginLeft, currentY)
      currentY += 3
    }
    if (formulario.value.emailName) {
      doc.text(`Email: ${formulario.value.emailName}`, marginLeft, currentY)
      currentY += 3
    }
    if (formulario.value.contacName) {
      doc.text(`Teléfono: ${formulario.value.contacName}`, marginLeft, currentY)
      currentY += 3
    }
    if (formulario.value.createdAt) {
      const fechaObj = new Date(formulario.value.createdAt)
      const dia = String(fechaObj.getDate()).padStart(2, '0')
      const mes = String(fechaObj.getMonth() + 1).padStart(2, '0')
      const año = String(fechaObj.getFullYear()).slice(-4)

      const fecha = `${dia}-${mes}-${año}`
      doc.text(`Fecha de creación A: ${fecha}`, marginLeft, currentY)
      currentY += 3
    }

  } else if (formulario.value.empresaId === 'B') {
    // 🔹 Condicionales de Empresa B
    const leftX = 10   // posición izquierda
    const rightX = 150 // posición derecha
    doc.setFontSize(10)
    // === Primera línea: Atención y Cotización ===
    let y = currentY
    doc.text(`ATENCIÓN:`, leftX, y)
    // Texto completo en negro

    doc.text(
      `Cotización: ${formulario.value.cotizacionId || '00000'}${formulario.value.version || '01'}`,
      rightX,
      y
    )

    // Si es 00000, dibujamos encima en rojo
    if (!formulario.value.cotizacionId) {
      doc.text('00000', rightX + doc.getTextWidth('Cotización: '), y)
    }

    currentY += 4  // avanzamos a la siguiente línea

    doc.setFontSize(9)
    // === Segunda línea: Nombre de la empresa y Fecha ===
    y = currentY
    doc.text(`${formulario.value.companyName || ''}`, marginLeft + 5, y)

    const fechaObj = new Date(formulario.value.createdAt || new Date())
    const dia = String(fechaObj.getDate()).padStart(2, '0')
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0')
    const año = String(fechaObj.getFullYear()).slice(-4)
    const fecha = `${dia}-${mes}-${año}`

    doc.text(`Fecha: ${fecha}`, rightX, y)


    // === Líneas adicionales: atención, email y contacto ===

    if (formulario.value.attentionName) {
      currentY += 4
      doc.text(`${formulario.value.attentionName}`, marginLeft + 5, currentY)
    }
    if (formulario.value.emailName) {
      currentY += 4
      doc.text(`${formulario.value.emailName}`, marginLeft + 5, currentY)
    }
    if (formulario.value.contacName) {
      currentY += 4
      doc.text(`${formulario.value.contacName}`, marginLeft + 5, currentY)
    }

    if (formulario.value.rutName) {
      currentY += 4
      doc.text(`${formulario.value.rutName}`, marginLeft + 5, currentY)
    }

  }
  currentY += 3



  // Descripción

  if (formulario.value.textSections?.length) {
    doc.setFontSize(8)

    currentY += 3

    doc.setFontSize(8)

    const pageHeight = doc.internal.pageSize.height
    const maxWidth = 180
    const lineHeight = 4.5
    const padding = 1

    formulario.value.textSections.forEach((section) => {
      const text = section.content
      const lines = doc.splitTextToSize(text, maxWidth)

      lines.forEach((line) => {
        if (currentY + lineHeight > pageHeight - padding) {
          doc.addPage()
          currentY = padding
        }

        doc.text(line, marginLeft, currentY)
        currentY += lineHeight
      })

      currentY += 2 // Espacio extra entre secciones
    })
  }

  // Secciones con productos
  formulario.value.sections.forEach((section, i) => {
    currentY += 4
    doc.setFontSize(8)
    doc.text(section.title || `ITEM ${i + 1}:`, marginLeft, currentY)

    currentY += 3

    const tableColumn = ['Cantidad', 'Unidad', 'Detalle', 'Valor Unitario', 'Total']
    const tableRows = section.fields.map(field => [
      field.quantity,
      field.unit || '',
      field.label,
      formatCurrency(field.unitPrice),
      formatCurrency(field.total)
    ])


    autoTable(doc, {
      startY: currentY,
      head: [tableColumn],
      body: tableRows,
      margin: { left: marginLeft },
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 0.5,
        overflow: 'ellipsize',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [30, 30, 30]
      },
      columnStyles: {
        '*': { cellPadding: 0.5 },
        0: { halign: 'right', cellWidth: 15 },  // Cantidad
        1: { halign: 'right', cellWidth: 15 },  // Unidad
        2: { halign: 'left' },                   // Detalle (sin ancho fijo)
        3: { halign: 'right', cellWidth: 25 },  // Valor Unitario
        4: { halign: 'right', cellWidth: 25 },  // Total
      },
      didParseCell: function (data) {
        if (data.section === 'head') {
          if (data.column.index === 2) {
            data.cell.styles.halign = 'left' // Detalle sigue a la izquierda
          } else {
            data.cell.styles.halign = 'right' // Todas las demás columnas a la derecha
          }
        }
      }
    })



    currentY = doc.lastAutoTable.finalY + 5
    // TOTAL NETO alineado a la derecha sin salirse del margen
    const rightMargin = 14 // margen desde el borde derecho
    doc.setFontSize(8)
    doc.text(
      `Total ${section.title || `Sección ${i + 1}`}: ${formatCurrency(formulario.value.totalPorSeccion[i])}`,
      doc.internal.pageSize.width - rightMargin,
      currentY,
      { align: 'right' }
    )

  })

  currentY += 4
  doc.setFontSize(10)
  doc.text('SUBTOTALES', marginLeft, currentY)
  currentY += 4

  // Tabla Total de servicio
  const totalServicioRows = formulario.value.totalPorSeccion.map((total, i) => [
    formulario.value.sections[i]?.title || `Sección ${i + 1}`,
    formatCurrency(total)
  ])

  autoTable(doc, {
    startY: currentY,
    head: [['Sección', 'Total']],
    body: totalServicioRows,
    margin: { left: marginLeft },
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 0.5,
      overflow: 'ellipsize',
      cellWidth: 'wrap'
    },
    headStyles: { fillColor: [50, 50, 50] },
    columnStyles: {

      1: { halign: 'right', cellWidth: 30 }, // Unidad

    }
  })
  currentY = doc.lastAutoTable.finalY + 4

  // TOTAL NETO alineado a la derecha sin salirse del margen
  const rightMargin = 14 // margen desde el borde derecho
  doc.setFontSize(8)
  doc.text(
    `SUBTOTALES: ${formatCurrency(formulario.value.totalGeneral)}`,
    doc.internal.pageSize.width - rightMargin,
    currentY,
    { align: 'right' }
  )


  currentY += 5

  // Resumen financiero como tabla
  doc.setFontSize(10)
  doc.text('Resumen Financiero', marginLeft, currentY)
  currentY += 6

  const rf = formulario.value.resumenFinanciero


  const utilidad = Number(formulario.value.utilidadPorcentaje)


  if (rf) {
    const resumenRows = [
      [`Gastos SSO, adm y util ${utilidad}%`, formatCurrency(rf.gastosSSO)],
      ['Neto', formatCurrency(rf.neto)],
      ['IVA (19%)', formatCurrency(rf.iva)],
      ['TOTAL', formatCurrency(rf.totalFinal)]
    ]

    autoTable(doc, {
      startY: currentY,
      head: [['Totales', '']],
      body: resumenRows,
      margin: { left: marginLeft },
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: 'ellipsize',
        cellWidth: 'wrap'
      },
      headStyles: { fillColor: [50, 50, 50] },
      columnStyles: {
        0: { halign: 'right' }, // Unidad
        1: { halign: 'right', cellWidth: 30 }, // Total
      }
    })
    currentY = doc.lastAutoTable.finalY + 7
  }



  // Detalles
  if (formulario.value.detalles) {
    doc.setFontSize(10)
    doc.text('Detalles de actividades:', marginLeft, currentY)
    currentY += 8

    doc.setFontSize(8)
    const detallesLines = doc.splitTextToSize(formulario.value.detalles, 180)

    if (currentY + detallesLines.length * 7 > doc.internal.pageSize.height - 20) {
      doc.addPage()
      currentY = 20
    }

    doc.text(detallesLines, marginLeft + 10, currentY)
    currentY += detallesLines.length * 7 + 5
  }

  // Verificar si hay espacio suficiente para la firma, si no, crear nueva página
  const signatureSpaceNeeded = 30
  if (currentY + signatureSpaceNeeded > doc.internal.pageSize.height - 10) {
    doc.addPage()
    currentY = 25
  }

  // Línea de firma y etiqueta
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginRight = 80
  const text = formulario.value.firmaTexto
  const textWidth = doc.getTextWidth(text)
  const posX = pageWidth - marginRight - textWidth

  doc.setFontSize(8)

  // Línea de firma (por ejemplo, 60 unidades de ancho)
  doc.line(posX, currentY + 12, posX + 60, currentY + 12)

  // Texto debajo de la línea (4 unidades más abajo)
  doc.text(text, posX + 10, currentY + 16)





  // === Pie de página ===
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  if (formulario.value.empresaId === 'B') {
    doc.text(
      'Documento BITNETS IP SPA - Versión 1.0',
      marginLeft,
      pageHeight - 10
    )
  } else {
    doc.text(
      'Documento BITNETS SPA - Versión 1.0',
      marginLeft,
      pageHeight - 10
    )
  }
  const numeroFormateado = `${String(doc.cotizacionId).padStart(5, "0")}${doc.version || "01"}`;
  if (formulario.value.empresaId === 'B') {
    void 0

  } else {
    doc.text(
      `Cotización: ${formulario.value.cotizacionId || '00000'}${formulario.value.version || '01'}`,
      doc.internal.pageSize.width - marginRight,
      pageHeight - 10,
      { align: 'right' }
    )
  }


  currentY += 0




  doc.save(`${formulario.value.name || 'formulario'}.pdf`)
}

// Función para formatear fechas
function formatDate(isoString) {
  if (!isoString) return 'Fecha no disponible'
  const fecha = new Date(isoString)
  return fecha.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(value) {
  if (isNaN(value)) return value
  return `$ ${Number(value).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const formularios = ref([])

async function loadFormularios() {
  const querySnapshot = await getDocs(collection(db, 'formularios'))
  formularios.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

import { onMounted, ref } from 'vue'

onMounted(async () => {
  const id = route.params.id
  const docRef = doc(db, 'formularios', id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    formularios.value = [{ id: docSnap.id, ...docSnap.data() }]
  } else {
    console.log('Formulario no encontrado')
  }
})


// AREA DE EDICION DE PAGINA
// AREA DE EDICION DE PAGINA
// AREA DE EDICION DE PAGINA

const modoEdicion = ref(false)

// Usar reactive para que Vue detecte cambios internos
const formEditable = reactive({
  name: '',
  sections: [
    {
      title: '',
      totalSection: 0, // ✅ inicializado desde el inicio
      fields: [
        { label: '', unitPrice: 0, quantity: 1, type: 'text', unit: 'uni', total: 0 }
      ]
    }
  ],
  textSections: [{ content: '' }],
  totalGeneral: 0,
  utilidadPorcentaje: 20,
  resumenFinanciero: {
    gastosSSO: 0,
    neto: 0,
    iva: 0,
    totalFinal: 0,
    fechaPago: ''
  },
  firmaTexto: ''
})



// 2️⃣ En cargarFormulario
const cargarFormulario = async () => {
  const docRef = doc(db, 'formularios', route.params.id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = sanitizeFormulario(docSnap.data())

    // Asegurarse de que textSections exista
    if (!data.textSections) data.textSections = []

    Object.assign(formEditable, data)
    return data
  } else {
    console.log('Formulario no encontrado')
    return null
  }
}

onMounted(() => {
  cargarFormulario()
})

function addTextSection() {
  formEditable.textSections.push({ content: '' })
  // Forzar re-render si fuera necesario
  formEditable.textSections = [...formEditable.textSections]
}

function removeLastTextSection() {
  if (formEditable.textSections.length > 0) {
    formEditable.textSections.pop()
  }
}


// Funciones para agregar productos y secciones
function addField(sectionIndex) {
  formEditable.sections[sectionIndex].fields.push({ label: '', unitPrice: 0, quantity: 1, type: 'text', unit: 'unidad' })
}



// Computeds para totales
const totalPorSeccion = computed(() =>
  (formEditable.sections || []).map(section =>
    (section.fields || []).reduce(
      (acc, field) => acc + (Number(field.unitPrice) || 0) * (Number(field.quantity) || 0),
      0
    )
  )
)

const totalGeneral = computed(() =>
  totalPorSeccion.value.reduce((acc, val) => acc + val, 0)
)

// Actualización automática del resumen financiero
watch(
  [totalGeneral, () => formEditable.utilidadPorcentaje],
  () => {
    formEditable.totalGeneral = totalGeneral.value
    formEditable.resumenFinanciero.gastosSSO = totalGeneral.value * (formEditable.utilidadPorcentaje / 100)
    formEditable.resumenFinanciero.neto = totalGeneral.value + formEditable.resumenFinanciero.gastosSSO
    formEditable.resumenFinanciero.iva = formEditable.resumenFinanciero.neto * 0.19
    formEditable.resumenFinanciero.totalFinal = formEditable.resumenFinanciero.neto + formEditable.resumenFinanciero.iva
  },
  { immediate: true }
)

function recalcularTotales(section) {
  // Actualiza el total de la sección
  section.totalSection = section.fields.reduce(
    (acc, field) => acc + (Number(field.quantity) || 0) * (Number(field.unitPrice) || 0),
    0
  )

  // Actualiza total general sumando todas las secciones
  formEditable.totalGeneral = formEditable.sections.reduce(
    (acc, s) => acc + (s.totalSection || 0),
    0
  )

  // Actualiza resumen financiero
  formEditable.resumenFinanciero.gastosSSO = formEditable.totalGeneral * (formEditable.utilidadPorcentaje / 100)
  formEditable.resumenFinanciero.neto = formEditable.totalGeneral + formEditable.resumenFinanciero.gastosSSO
  formEditable.resumenFinanciero.iva = formEditable.resumenFinanciero.neto * 0.19
  formEditable.resumenFinanciero.totalFinal = formEditable.resumenFinanciero.neto + formEditable.resumenFinanciero.iva
}

const guardarCambios = async () => {
  try {
    // Recalcular totalPorSeccion antes de guardar
    const totalPorSeccion = formEditable.sections.map(s => s.totalSection || 0)

    // Recalcular totalGeneral también
    const totalGeneral = totalPorSeccion.reduce((acc, val) => acc + val, 0)

    // Actualizar resumen financiero
    const gastosSSO = totalGeneral * (formEditable.utilidadPorcentaje / 100)
    const neto = totalGeneral + gastosSSO
    const iva = neto * 0.19
    const totalFinal = neto + iva

    // Guardar en Firestore
    await setDoc(doc(db, 'formularios', route.params.id), {
      ...formEditable,
      totalPorSeccion,
      totalGeneral,
      resumenFinanciero: {
        gastosSSO,
        neto,
        iva,
        totalFinal,
        fechaPago: formEditable.resumenFinanciero.fechaPago
      },
      ordenCompra: formEditable.ordenCompra || '',
      factura: formEditable.factura || '',
      fechaFactura: formEditable.fechaFactura || ''
    }, { merge: true })
    // ✅ solución rápida: refrescar los datos desde Firestore
    const dataActualizada = await cargarFormulario()
    formulario.value = dataActualizada

    console.log('Formulario guardado correctamente')
    modoEdicion.value = false
  } catch (err) {
    console.error('Error al guardar:', err)
  }
}

function addSection() {
  formEditable.sections.push({
    title: '',
    fields: [{ label: '', unitPrice: 0, quantity: 1, unit: 'unidad', total: 0 }],
    totalSection: 0
  })
}

function removeSection(index) {
  formEditable.sections.splice(index, 1)
}

function removeLastField(sectionIndex) {
  const fields = formEditable.sections[sectionIndex].fields
  if (fields.length > 0) {
    fields.pop()  // Elimina el último producto
    recalcularTotales(formEditable.sections[sectionIndex])
  }
}

function removeLastSection() {
  if (formEditable.sections.length > 0) {
    formEditable.sections.pop()  // Elimina la última sección creada
  }
}

async function eliminarFormulario() {
  try {
    const confirmacion = confirm("⚠️ ¿Estás seguro de que quieres borrar este formulario? Esta acción no se puede deshacer.")
    if (!confirmacion) return

    await deleteDoc(doc(db, "formularios", route.params.id))
    alert("Formulario eliminado correctamente ✅")
    router.push("/historial") // redirige al historial o donde prefieras
  } catch (error) {
    console.error("Error al eliminar el formulario:", error)
    alert("Ocurrió un error al eliminar el formulario ❌")
  }
}


</script>
