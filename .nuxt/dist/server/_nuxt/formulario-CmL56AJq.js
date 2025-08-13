import { ref, computed, unref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import "./firebase-HMQi2bTd.js";
import "firebase/firestore";
import "firebase/app";
const _sfc_main = {
  __name: "formulario",
  __ssrInlineRender: true,
  setup(__props) {
    const clientes = ref([]);
    const selectedClientId = ref("");
    const companyName = ref("");
    const attentionName = ref("");
    const emailName = ref("");
    const contacName = ref("");
    const formName = ref("");
    const sections = ref([
      {
        title: "",
        fields: [{ label: "", unitPrice: 0, quantity: 1, type: "text", unit: "unidad" }]
      }
    ]);
    const totalPorSeccion = computed(
      () => sections.value.map(
        (section) => section.fields.reduce(
          (acc, field) => acc + (Number(field.unitPrice) || 0) * (Number(field.quantity) || 0),
          0
        )
      )
    );
    const totalGeneral = computed(
      () => totalPorSeccion.value.reduce((acc, val) => acc + val, 0)
    );
    const utilidadPorcentaje = ref(20);
    const gastosSSO = computed(() => totalGeneral.value * (utilidadPorcentaje.value / 100));
    const neto = computed(() => totalGeneral.value + gastosSSO.value);
    const iva = computed(() => neto.value * 0.19);
    const totalFinal = computed(() => neto.value + iva.value);
    const textSections = ref([
      { content: "" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"> Volver a página principal </button><main class="max-w-7xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-gray-300 mb-5"><h1 class="text-3xl font-semibold mb-6 text-gray-200">Crear Nuevo Formulario</h1><form class="space-y-8"><div class="mb-6 bg-gray-800 p-4 rounded border border-gray-700 text-gray-200"><label for="clientSelect" class="block mb-1 font-medium">Seleccionar Cliente</label><select id="clientSelect" class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"><option value=""${ssrIncludeBooleanAttr(Array.isArray(selectedClientId.value) ? ssrLooseContain(selectedClientId.value, "") : ssrLooseEqual(selectedClientId.value, "")) ? " selected" : ""}>-- Selecciona un cliente --</option><!--[-->`);
      ssrRenderList(clientes.value, (clientes2) => {
        _push(`<option${ssrRenderAttr("value", clientes2.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedClientId.value) ? ssrLooseContain(selectedClientId.value, clientes2.id) : ssrLooseEqual(selectedClientId.value, clientes2.id)) ? " selected" : ""}>${ssrInterpolate(clientes2.name)}</option>`);
      });
      _push(`<!--]--></select></div><div><label for="formName" class="block text-gray-400 font-medium mb-2">Nombre del formulario</label><input${ssrRenderAttr("value", formName.value)} id="formName" type="text" placeholder="Ej: Encuesta de satisfacción" required class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition text-gray-200"></div><div class="mb-6 bg-gray-800 p-4 rounded border border-gray-700 text-gray-200"><h2 class="text-lg font-semibold mb-4">Información de la empresa</h2><div class="mb-4"><label for="companyName" class="block mb-1 font-medium">Nombre de la empresa/entidad</label><input id="companyName"${ssrRenderAttr("value", companyName.value)} type="text" placeholder="Ej: ACME Ltda." class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"></div><div class="mb-4"><label for="attentionName" class="block mb-1 font-medium">Atención a</label><input id="attentionName"${ssrRenderAttr("value", attentionName.value)} type="text" placeholder="Ej: Juan Pérez" class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"></div><div class="mb-4"><label for="emailName" class="block mb-1 font-medium">Email</label><input id="emailName"${ssrRenderAttr("value", emailName.value)} type="text" placeholder="Ej: FME@gmail.com" class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"></div><div class="mb-4"><label for="contacName" class="block mb-1 font-medium">Contacto</label><input id="contacName"${ssrRenderAttr("value", contacName.value)} type="text" placeholder="Ej: FME@gmail.com" class="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"></div></div><div class="mb-8"><h2 class="text-xl font-semibold text-gray-200 mb-4">Secciones de Texto</h2><!--[-->`);
      ssrRenderList(textSections.value, (textSection, index) => {
        _push(`<div class="mb-4 relative"><textarea rows="4" placeholder="Escribe aquí detalles o descripción" class="w-full rounded border border-gray-700 bg-gray-800 px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200">${ssrInterpolate(textSection.content)}</textarea><button type="button" class="absolute top-0 right-0 mt-1 mr-1 text-red-500 hover:text-red-700 font-bold text-xl" aria-label="Eliminar sección de texto"> × </button></div>`);
      });
      _push(`<!--]--><button type="button" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200"> + Agregar sección de texto </button></div><!--[-->`);
      ssrRenderList(sections.value, (section, sIndex) => {
        _push(`<div class="border border-gray-700 rounded p-4 mb-6"><div class="flex justify-between items-center mb-4"><input${ssrRenderAttr("value", section.title)} type="text" placeholder="Título de la sección" class="flex-grow rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200" required><button type="button" class="ml-4 text-red-500 hover:text-red-700 font-bold" aria-label="Eliminar sección"> × </button></div><!--[-->`);
        ssrRenderList(section.fields, (field, fIndex) => {
          _push(`<div class="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4"><input${ssrRenderAttr("value", field.label)} type="text" placeholder="Nombre del producto" class="flex-grow rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 mb-2 md:mb-0" required><div class="flex items-center space-x-2"><input${ssrRenderAttr("value", field.quantity)} type="number" min="1" placeholder="Cantidad" class="w-25 text-center rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200" required></div><select class="w-32 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2 md:mb-0"><option value="unidad"${ssrIncludeBooleanAttr(Array.isArray(field.unit) ? ssrLooseContain(field.unit, "unidad") : ssrLooseEqual(field.unit, "unidad")) ? " selected" : ""}>Unidad</option><option value="metro"${ssrIncludeBooleanAttr(Array.isArray(field.unit) ? ssrLooseContain(field.unit, "metro") : ssrLooseEqual(field.unit, "metro")) ? " selected" : ""}>Metro</option><option value="litro"${ssrIncludeBooleanAttr(Array.isArray(field.unit) ? ssrLooseContain(field.unit, "litro") : ssrLooseEqual(field.unit, "litro")) ? " selected" : ""}>Litro</option><option value="kg"${ssrIncludeBooleanAttr(Array.isArray(field.unit) ? ssrLooseContain(field.unit, "kg") : ssrLooseEqual(field.unit, "kg")) ? " selected" : ""}>Kg</option><option value="otro"${ssrIncludeBooleanAttr(Array.isArray(field.unit) ? ssrLooseContain(field.unit, "otro") : ssrLooseEqual(field.unit, "otro")) ? " selected" : ""}>Otro</option></select><input${ssrRenderAttr("value", field.unitPrice)} type="number" min="0" step="0.01" placeholder="Valor unitario" class="w-40 rounded border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 mb-2 md:mb-0" required><div class="ml-auto text-gray-300 font-semibold"> Total: $${ssrInterpolate(Math.round((Number(field.unitPrice) || 0) * (Number(field.quantity) || 0)))}</div><button type="button" class="ml-4 text-red-500 hover:text-red-700 font-bold text-xl" aria-label="Eliminar producto"> × </button></div>`);
        });
        _push(`<!--]--><div class="flex justify-end font-semibold text-gray-300 mt-2"> Total sección: $${ssrInterpolate(Math.round(unref(totalPorSeccion)[sIndex] || 0))}</div><button type="button" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200"> + Agregar producto </button></div>`);
      });
      _push(`<!--]--><button type="button" class="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded text-gray-200 font-semibold"> + Agregar sección </button><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6"><h2 class="text-lg font-semibold text-gray-200 mb-3">Total de servicio</h2><ul class="space-y-2"><!--[-->`);
      ssrRenderList(unref(totalPorSeccion), (sectionTotal, index) => {
        _push(`<li class="flex justify-between text-gray-300"><span>${ssrInterpolate(sections.value[index].title || `Sección ${index + 1}`)}</span><span>$ ${ssrInterpolate(Math.round(sectionTotal || 0))}</span></li>`);
      });
      _push(`<!--]--></ul><div class="mt-4 text-right font-bold text-gray-100 text-lg border-t border-gray-600 pt-2"> TOTAL NETO: $${ssrInterpolate(Math.round(unref(totalGeneral) || 0))}</div></div><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6"><h2 class="text-lg font-semibold text-gray-200 mb-3">Resumen Financiero</h2><ul class="space-y-2 text-gray-300"><li class="flex justify-between items-center space-x-2"><span>Gastos SSO, adm y util</span><input type="number" min="0" max="100"${ssrRenderAttr("value", utilidadPorcentaje.value)} class="w-16 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"><span>%</span><span class="ml-auto">$ ${ssrInterpolate(Math.round(unref(gastosSSO) || 0))}</span></li><li class="flex justify-between"><span>Neto</span><span>$ ${ssrInterpolate(Math.round(unref(neto) || 0))}</span></li><li class="flex justify-between"><span>IVA (19%)</span><span>$ ${ssrInterpolate(Math.round(unref(iva) || 0))}</span></li><li class="flex justify-between font-bold text-gray-100 border-t border-gray-600 pt-2"><span>TOTAL</span><span>$ ${ssrInterpolate(Math.round(unref(totalFinal) || 0))}</span></li></ul></div><div><button type="submit" class="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-md transition"> Guardar Formulario </button></div></form></main><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/formulario.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=formulario-CmL56AJq.js.map
