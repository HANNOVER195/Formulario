import { ssrRenderAttr } from "vue/server-renderer";
import { ref, useSSRContext } from "vue";
import "./firebase-HMQi2bTd.js";
import "firebase/firestore";
import "firebase/app";
const _sfc_main = {
  __name: "ClienteCreate",
  __ssrInlineRender: true,
  setup(__props) {
    const clientName = ref("");
    const contactPerson = ref("");
    const email = ref("");
    const phone = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"> Volver a página principal </button><main class="max-w-3xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-gray-300 mb-5"><h1 class="text-3xl font-semibold mb-6 text-gray-200">Crear Nuevo Cliente</h1><form class="space-y-6"><div><label for="clientName" class="block text-gray-400 font-medium mb-2">Nombre del Cliente</label><input${ssrRenderAttr("value", clientName.value)} id="clientName" type="text" placeholder="Ej: ACME Ltda." required class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"></div><div><label for="contactPerson" class="block text-gray-400 font-medium mb-2">Contacto Principal</label><input${ssrRenderAttr("value", contactPerson.value)} id="contactPerson" type="text" placeholder="Ej: Juan Pérez" class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"></div><div><label for="email" class="block text-gray-400 font-medium mb-2">Correo Electrónico</label><input${ssrRenderAttr("value", email.value)} id="email" type="email" placeholder="ejemplo@correo.com" class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"></div><div><label for="phone" class="block text-gray-400 font-medium mb-2">Teléfono</label><input${ssrRenderAttr("value", phone.value)} id="phone" type="tel" placeholder="+56 9 1234 5678" class="w-full border border-gray-700 bg-gray-800 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"></div><div><button type="submit" class="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-md transition"> Guardar Cliente </button></div></form></main><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ClienteCreate.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=ClienteCreate-DhtG46c5.js.map
