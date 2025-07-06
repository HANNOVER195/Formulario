<template>
  <button
    @click="$router.push('/historial')"
    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"
  >
    Volver al historial
  </button>

  <main
    ref="contentToPrint"
    class="max-w-5xl mx-auto p-6 rounded-lg shadow-lg"
    :style="{ backgroundColor: '#1a202c', color: '#e2e8f0' }"
  >
    <h1 class="text-3xl font-bold mb-4 text-gray-200">{{ formulario?.name || 'Formulario' }}</h1>

    <!-- Información general -->
    <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6 text-sm text-gray-300">
      <p><strong>Empresa:</strong> {{ formulario?.companyName || '-' }}</p>
      <p><strong>Atención a:</strong> {{ formulario?.attentionName || '-' }}</p>
      <p><strong>Fecha de creación:</strong> {{ formatDate(formulario?.createdAt) }}</p>
    </div>

    
    

    <div v-if="formulario">
      
       <!-- Descripciones generales -->
      <div v-if="formulario.descripcion || formulario.detalles" class="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
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
        <h2 class="text-xl font-semibold text-gray-100 mb-3">{{ section.title || `Sección ${index + 1}` }}</h2>
        <table class="w-full text-left text-gray-300 mb-3">
          <thead>
            <tr class="border-b border-gray-600">
              <th class="py-2">Producto</th>
              <th class="py-2">Unidad</th>
              <th class="py-2">Valor Unitario</th>
              <th class="py-2">Cantidad</th>
              <th class="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(field, idx) in section.fields" :key="idx" class="border-t border-gray-800">
              <td class="py-2">{{ field.label }}</td>
              <td class="py-2">{{ field.unit }}</td>
              <td class="py-2">$ {{ formatNumber(field.unitPrice) }}</td>
              <td class="py-2">{{ field.quantity }}</td>
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
          TOTAL NETO: ${{ formatNumber(formulario.totalGeneral) }}
        </div>
      </div>

      <!-- Resumen financiero -->
      <div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-100 mb-3">Resumen Financiero</h2>
        <ul class="text-gray-300 space-y-1">
          <li class="flex justify-between"><span>Gastos SSO, adm y util 20%</span><span>$ {{ formatNumber(formulario.resumenFinanciero?.gastosSSO) }}</span></li>
          <li class="flex justify-between"><span>Neto</span><span>$ {{ formatNumber(formulario.resumenFinanciero?.neto) }}</span></li>
          <li class="flex justify-between"><span>IVA (19%)</span><span>$ {{ formatNumber(formulario.resumenFinanciero?.iva) }}</span></li>
          <li class="flex justify-between font-bold border-t border-gray-600 pt-2 text-gray-100">
            <span>TOTAL</span><span>$ {{ formatNumber(formulario.resumenFinanciero?.totalFinal) }}</span>
          </li>
        </ul>
      </div>
    </div>

    

    <div v-else class="text-center text-gray-400">Cargando información...</div>
  </main>

  <!-- Botón para exportar PDF -->
  <div class="max-w-5xl mx-auto p-6 flex justify-end">
    <button
      @click="exportPDF"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      :disabled="!formulario"
    >
      Exportar a PDF
    </button>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '~/firebase/firebase'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const route = useRoute()
const formulario = ref(null)

function formatNumber(value) {
  if (value == null || isNaN(value)) return '0'
  return Number(value).toLocaleString('es-CL', { maximumFractionDigits: 0 })
}

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    alert('ID de formulario no especificado')
    return
  }
  const docRef = doc(db, 'formularios', id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    formulario.value = docSnap.data()
  } else {
    alert('Formulario no encontrado.')
  }
})

function exportPDF() {
  const doc = new jsPDF()
  const marginLeft = 15
  let currentY = 20

  // Título principal
  doc.setFontSize(18)
  doc.text(formulario.value.name || 'Formulario', marginLeft, currentY)
  currentY += 10

  // Datos generales
  doc.setFontSize(12)
  if (formulario.value.companyName) {
    doc.text(`Empresa: ${formulario.value.companyName}`, marginLeft, currentY)
    currentY += 6
  }
  if (formulario.value.attentionName) {
    doc.text(`A nombre de: ${formulario.value.attentionName}`, marginLeft, currentY)
    currentY += 6
  }
  if (formulario.value.createdAt?.toDate) {
    const fecha = formulario.value.createdAt.toDate().toLocaleString('es-CL')
    doc.text(`Fecha de creación: ${fecha}`, marginLeft, currentY)
    currentY += 10
  }

  // Secciones con productos
  formulario.value.sections.forEach((section, i) => {
    currentY += 10
    doc.setFontSize(14)
    doc.text(section.title || `Sección ${i + 1}`, marginLeft, currentY)
    currentY += 6

    const tableColumn = ['Producto', 'Unidad', 'Valor Unitario', 'Cantidad', 'Total']
    const tableRows = section.fields.map(field => [
      field.label,
      field.unit || '',
      `$ ${field.unitPrice}`,
      field.quantity,
      `$ ${field.total}`
    ])

    autoTable(doc, {
      startY: currentY,
      head: [tableColumn],
      body: tableRows,
      margin: { left: marginLeft },
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 30, 30] }
    })

    currentY = doc.lastAutoTable.finalY + 5
    doc.setFontSize(12)
    doc.text(`Total sección: $${section.totalSection}`, marginLeft + 120, currentY)
  })

  currentY += 10
  doc.setFontSize(14)
  doc.text('Total de servicio', marginLeft, currentY)
  currentY += 6

  // Tabla Total de servicio
  const totalServicioRows = formulario.value.totalPorSeccion.map((total, i) => [
    formulario.value.sections[i]?.title || `Sección ${i + 1}`,
    `$${total}`
  ])
  autoTable(doc, {
    startY: currentY,
    head: [['Sección', 'Total']],
    body: totalServicioRows,
    margin: { left: marginLeft },
    theme: 'grid',
    styles: { fontSize: 12 },
    headStyles: { fillColor: [50, 50, 50] }
  })
  currentY = doc.lastAutoTable.finalY + 10

  // TOTAL NETO resaltado
  doc.setFontSize(12)
  doc.text(`TOTAL NETO: $${formulario.value.totalGeneral}`, marginLeft + 10, currentY)
  currentY += 15

  // Resumen financiero como tabla
  doc.setFontSize(14)
  doc.text('Resumen Financiero', marginLeft, currentY)
  currentY += 6

  const rf = formulario.value.resumenFinanciero
  if (rf) {
    const resumenRows = [
      ['Gastos SSO, adm y util 20%', `$${rf.gastosSSO}`],
      ['Neto', `$${rf.neto}`],
      ['IVA (19%)', `$${rf.iva}`],
      ['TOTAL', `$${rf.totalFinal}`]
    ]
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Monto']],
      body: resumenRows,
      margin: { left: marginLeft },
      theme: 'grid',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [50, 50, 50] }
    })
    currentY = doc.lastAutoTable.finalY + 10
  }

  // Descripción
if (formulario.value.textSections?.length) {
  doc.setFontSize(14)
  doc.text('Secciones Descriptivas:', marginLeft, currentY)
  currentY += 8

  doc.setFontSize(12)
  formulario.value.textSections.forEach((section, i) => {
    const lines = doc.splitTextToSize(`📌 ${section.content}`, 180)

    if (currentY + lines.length * 7 > doc.internal.pageSize.height - 20) {
      doc.addPage()
      currentY = 20
    }

    doc.text(lines, marginLeft + 10, currentY)
    currentY += lines.length * 7 + 5
  })
}
 else {
  console.warn('La descripción está vacía o no es un string válido.')
}



  // Detalles
  if (formulario.value.detalles) {
    doc.setFontSize(14)
    doc.text('Detalles de actividades:', marginLeft, currentY)
    currentY += 8

    doc.setFontSize(12)
    const detallesLines = doc.splitTextToSize(formulario.value.detalles, 180)

    if (currentY + detallesLines.length * 7 > doc.internal.pageSize.height - 20) {
      doc.addPage()
      currentY = 20
    }

    doc.text(detallesLines, marginLeft + 10, currentY)
    currentY += detallesLines.length * 7 + 5
  }

  doc.save(`${formulario.value.name || 'formulario'}.pdf`)
}

// Función para formatear fechas
function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return 'Fecha no disponible'
  return timestamp.toDate().toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>


