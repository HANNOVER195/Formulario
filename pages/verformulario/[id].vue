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
      <p><strong>Email:</strong> {{ formulario?.emailName || '-' }}</p>
      <p><strong>Teléfono:</strong> {{ formulario?.contacName || '-' }}</p>
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
definePageMeta({
  ssr: false
})



import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '~/firebase/firebase'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
        total: field.total ?? 0
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
    }
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


// Título principal
doc.setFontSize(8)
doc.setFont('helvetica', 'bold')
doc.text('BITNETS SPA', marginLeft, currentY)

// Logo a la derecha (usar imagen en Base64 o data:image/png;base64,...)
// Ajusta las coordenadas y tamaño según tu logo
doc.addImage(logoBase64, 'PNG', 160, currentY - 1, 30, 10)

currentY += 4

// Subtítulo o detalles
doc.setFontSize(8)
doc.setFont('helvetica', 'normal')
doc.text(`Servicios Integrales en Tecnologia`, marginLeft, currentY)
currentY += 3
doc.text(`RUT: 76.504.212-7`, marginLeft, currentY)
currentY += 3
doc.text(`Caulin s/n - ANCUD`, marginLeft, currentY)
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
      const fecha = new Date(formulario.value.createdAt).toLocaleString('es-CL')
      doc.text(`Fecha de creación: ${fecha}`, marginLeft, currentY)
      currentY += 3
    }


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

  }})
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
    }})
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
    const text = 'BITNETS spa'
    const textWidth = doc.getTextWidth(text)
    const posX = pageWidth - marginRight - textWidth

    doc.setFontSize(8)

    // Línea de firma (por ejemplo, 60 unidades de ancho)
    doc.line(posX, currentY + 12, posX + 60, currentY + 12)

    // Texto debajo de la línea (4 unidades más abajo)
    doc.text(text, posX+10, currentY + 16)



 

    // === Pie de página ===
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text(
      'Documento BITNETS SpA - Versión 1.0',
      marginLeft,
      pageHeight - 10
    )
    const numeroFormateado = `${String(doc.cotizacionId).padStart(5, "0")}${doc.version || "01"}`;
    doc.text(
  `Cotización: ${formulario.value.cotizacionId || '00000'}${formulario.value.version || '01'}`,
  doc.internal.pageSize.width - marginRight,
  pageHeight - 10,
  { align: 'right' }
)

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



</script>


