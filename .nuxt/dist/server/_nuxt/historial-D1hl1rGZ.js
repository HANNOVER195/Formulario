import { ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { ref, useSSRContext } from "vue";
import "firebase/firestore";
import "./firebase-HMQi2bTd.js";
import { useRouter } from "vue-router";
import "firebase/app";
const _sfc_main = {
  __name: "historial",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const formularios = ref([]);
    const loading = ref(true);
    function formatDate(timestamp) {
      if (!(timestamp == null ? void 0 : timestamp.toDate)) return "Fecha desconocida";
      const date = timestamp.toDate();
      return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"> Volver a página principal </button><main class="max-w-3xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-gray-300 min-h-[400px]"><h1 class="text-3xl font-semibold mb-6 text-gray-200 text-center">Historial de Formularios</h1>`);
      if (loading.value) {
        _push(`<div class="text-center text-gray-400">Cargando formularios...</div>`);
      } else if (formularios.value.length === 0) {
        _push(`<div class="text-center text-gray-400"> No hay historiales disponibles por ahora. </div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(formularios.value, (form) => {
          var _a;
          _push(`<div class="border border-gray-700 bg-gray-800 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"><h2 class="text-xl font-bold text-gray-100">${ssrInterpolate(form.name)}</h2><p class="text-sm text-gray-400">Fecha: ${ssrInterpolate(formatDate(form.createdAt))}</p><p class="text-md font-semibold text-green-300 mt-2"> Total Final: $${ssrInterpolate(((_a = form.resumenFinanciero) == null ? void 0 : _a.totalFinal) ? Math.round(form.resumenFinanciero.totalFinal) : 0)}</p></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</main><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/historial.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=historial-D1hl1rGZ.js.map
