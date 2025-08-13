import { defineComponent, createElementBlock, shallowRef, getCurrentInstance, provide, cloneVNode, h, computed, toValue, onServerPrefetch, ref, toRef, nextTick, unref, withAsyncContext, useSSRContext } from "vue";
import { ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { d as db } from "./firebase-HMQi2bTd.js";
import "jspdf";
import "jspdf-autotable";
import "C:/Users/Imer/Documents/GitHub/Formulario/node_modules/hookable/dist/index.mjs";
import { debounce } from "C:/Users/Imer/Documents/GitHub/Formulario/node_modules/perfect-debounce/dist/index.mjs";
import { a as useNuxtApp, d as asyncDataDefaults, e as createError } from "../server.mjs";
import "firebase/app";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/Imer/Documents/GitHub/Formulario/node_modules/unctx/dist/index.mjs";
import "C:/Users/Imer/Documents/GitHub/Formulario/node_modules/h3/dist/index.mjs";
import "C:/Users/Imer/Documents/GitHub/Formulario/node_modules/radix3/dist/index.mjs";
import "C:/Users/Imer/Documents/GitHub/Formulario/node_modules/defu/dist/defu.mjs";
import "C:/Users/Imer/Documents/GitHub/Formulario/node_modules/ufo/dist/index.mjs";
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ?? (options.server = true);
  options.default ?? (options.default = getDefault);
  options.getCachedData ?? (options.getCachedData = getDefaultCachedData);
  options.lazy ?? (options.lazy = false);
  options.immediate ?? (options.immediate = true);
  options.deep ?? (options.deep = asyncDataDefaults.deep);
  options.dedupe ?? (options.dedupe = "cancel");
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!((_a = nuxtApp._asyncData[key.value]) == null ? void 0 : _a._init)) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.data;
    }),
    pending: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.pending;
    }),
    status: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.status;
    }),
    error: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.error;
    }),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      var _a;
      return (_a = getter()) == null ? void 0 : _a.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    {
      nuxtApp._asyncData[key].pending.value = false;
    }
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  var _a, _b;
  (_a = nuxtApp.payload._errors)[key] ?? (_a[key] = asyncDataDefaults.errorValue);
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = !import.meta.prerender || !((_b = nuxtApp.ssrContext) == null ? void 0 : _b._sharedPrerenderCache) ? _handler : () => {
    const value = nuxtApp.ssrContext._sharedPrerenderCache.get(key);
    if (value) {
      return value;
    }
    const promise = Promise.resolve().then(() => nuxtApp.runWithContext(() => _handler(nuxtApp)));
    nuxtApp.ssrContext._sharedPrerenderCache.set(key, promise);
    return promise;
  };
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData != null;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: shallowRef(!hasCachedData),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (opts = {}) => {
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer(opts.dedupe ?? options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData != null) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = asyncDataDefaults.errorValue;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      {
        asyncData.pending.value = true;
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = asyncDataDefaults.errorValue;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        {
          asyncData.pending.value = false;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      var _a2;
      unsubRefreshAsyncData();
      if ((_a2 = nuxtApp._asyncData[key]) == null ? void 0 : _a2._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          var _a3;
          if (!((_a3 = nuxtApp._asyncData[key]) == null ? void 0 : _a3._init)) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
            asyncData.data.value = asyncDataDefaults.value;
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => asyncDataDefaults.value;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    function formatNumber(value) {
      if (value == null || isNaN(value)) return "0";
      return Number(value).toLocaleString("es-CL", { maximumFractionDigits: 0 });
    }
    function sanitizeFormulario(data) {
      var _a, _b, _c, _d, _e, _f, _g;
      const toISO = (ts) => (ts == null ? void 0 : ts.toDate) ? ts.toDate().toISOString() : ts ?? null;
      return {
        ...data,
        // Mantener los nombres que estás usando en el formulario / DB
        companyName: data.companyName ?? "",
        attentionName: data.attentionName ?? "",
        emailName: data.emailName ?? "",
        // <-- usar el mismo nombre que guardas
        contacName: data.contacName ?? "",
        // <-- idem (phone quedó guardado como contacName)
        createdAt: toISO(data.createdAt),
        descripcion: data.descripcion ?? "",
        detalles: data.detalles ?? "",
        textSections: ((_a = data.textSections) == null ? void 0 : _a.map((section) => ({
          content: section.content ?? ""
        }))) ?? [],
        sections: ((_b = data.sections) == null ? void 0 : _b.map((section) => {
          var _a2;
          return {
            title: section.title ?? "",
            totalSection: section.totalSection ?? 0,
            fields: ((_a2 = section.fields) == null ? void 0 : _a2.map((field) => ({
              label: field.label ?? "",
              unit: field.unit ?? "",
              unitPrice: field.unitPrice ?? 0,
              quantity: field.quantity ?? 0,
              total: field.total ?? 0
            }))) ?? []
          };
        })) ?? [],
        totalPorSeccion: data.totalPorSeccion ?? [],
        totalGeneral: data.totalGeneral ?? 0,
        utilidadPorcentaje: data.utilidadPorcentaje ?? 20,
        // <-- lo lees directo de data
        resumenFinanciero: {
          gastosSSO: ((_c = data.resumenFinanciero) == null ? void 0 : _c.gastosSSO) ?? 0,
          neto: ((_d = data.resumenFinanciero) == null ? void 0 : _d.neto) ?? 0,
          iva: ((_e = data.resumenFinanciero) == null ? void 0 : _e.iva) ?? 0,
          totalFinal: ((_f = data.resumenFinanciero) == null ? void 0 : _f.totalFinal) ?? 0,
          fechaPago: toISO((_g = data.resumenFinanciero) == null ? void 0 : _g.fechaPago)
        }
      };
    }
    const { data: formulario, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`formulario-${route.params.id}`, async () => {
      const docRef = doc(db, "formularios", route.params.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw createError({ statusCode: 404, statusMessage: "Formulario no encontrado" });
      }
      const rawData = docSnap.data();
      return sanitizeFormulario(rawData);
    })), __temp = await __temp, __restore(), __temp);
    function formatDate(isoString) {
      if (!isoString) return "Fecha no disponible";
      const fecha = new Date(isoString);
      return fecha.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      _push(`<!--[--><button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"> Volver al historial </button><main class="max-w-5xl mx-auto p-6 rounded-lg shadow-lg" style="${ssrRenderStyle({ backgroundColor: "#1a202c", color: "#e2e8f0" })}"><h1 class="text-3xl font-bold mb-4 text-gray-200">${ssrInterpolate(((_a = unref(formulario)) == null ? void 0 : _a.name) || "Formulario")}</h1><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6 text-sm text-gray-300"><p><strong>Empresa:</strong> ${ssrInterpolate(((_b = unref(formulario)) == null ? void 0 : _b.companyName) || "-")}</p><p><strong>Atención a:</strong> ${ssrInterpolate(((_c = unref(formulario)) == null ? void 0 : _c.attentionName) || "-")}</p><p><strong>Email:</strong> ${ssrInterpolate(((_d = unref(formulario)) == null ? void 0 : _d.emailName) || "-")}</p><p><strong>Teléfono:</strong> ${ssrInterpolate(((_e = unref(formulario)) == null ? void 0 : _e.contacName) || "-")}</p><p><strong>Fecha de creación:</strong> ${ssrInterpolate(formatDate((_f = unref(formulario)) == null ? void 0 : _f.createdAt))}</p></div>`);
      if (unref(formulario)) {
        _push(`<div>`);
        if (unref(formulario).descripcion || unref(formulario).detalles) {
          _push(`<div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4"><h2 class="text-lg font-semibold text-gray-100 mb-2">Detalles del formulario</h2>`);
          if (unref(formulario).descripcion) {
            _push(`<p class="mb-2"><strong>Descripción:</strong> ${ssrInterpolate(unref(formulario).descripcion)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(formulario).detalles) {
            _push(`<p><strong>Detalles de actividades:</strong> ${ssrInterpolate(unref(formulario).detalles)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_g = unref(formulario).textSections) == null ? void 0 : _g.length) {
          _push(`<div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4"><h2 class="text-lg font-semibold text-gray-100 mb-2">Secciones Descriptivas</h2><!--[-->`);
          ssrRenderList(unref(formulario).textSections, (text, index) => {
            _push(`<div class="mb-2"><p class="text-gray-300">📌 ${ssrInterpolate(text.content)}</p></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(formulario).sections, (section, index) => {
          _push(`<div class="border border-gray-700 rounded p-4 mb-6"><h2 class="text-xl font-semibold text-gray-100 mb-3">${ssrInterpolate(section.title || `ITEM ${index + 1}`)}</h2><table class="w-full text-left text-gray-300 mb-3"><thead><tr class="border-b border-gray-600"><th class="py-2">Producto</th><th class="py-2">Cantidad</th><th class="py-2">Unidad</th><th class="py-2">Valor Unitario</th><th class="py-2">Total</th></tr></thead><tbody><!--[-->`);
          ssrRenderList(section.fields, (field, idx) => {
            _push(`<tr class="border-t border-gray-800"><td class="py-2">${ssrInterpolate(field.label)}</td><td class="py-2">${ssrInterpolate(field.quantity)}</td><td class="py-2">${ssrInterpolate(field.unit)}</td><td class="py-2">$ ${ssrInterpolate(formatNumber(field.unitPrice))}</td><td class="py-2">$ ${ssrInterpolate(formatNumber(field.total))}</td></tr>`);
          });
          _push(`<!--]--></tbody></table><div class="text-right font-semibold text-gray-200"> Total sección: $${ssrInterpolate(formatNumber(section.totalSection))}</div></div>`);
        });
        _push(`<!--]--><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4"><h2 class="text-lg font-semibold text-gray-100 mb-3">Total de servicio</h2><ul class="text-gray-300 space-y-1"><!--[-->`);
        ssrRenderList(unref(formulario).totalPorSeccion, (total, index) => {
          var _a2;
          _push(`<li class="flex justify-between"><span>${ssrInterpolate(((_a2 = unref(formulario).sections[index]) == null ? void 0 : _a2.title) || `Sección ${index + 1}`)}</span><span>$ ${ssrInterpolate(formatNumber(total))}</span></li>`);
        });
        _push(`<!--]--></ul><div class="mt-2 text-right font-bold text-lg text-gray-100 border-t border-gray-600 pt-2"> SUBTOTALES: $${ssrInterpolate(formatNumber(unref(formulario).totalGeneral))}</div></div><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4"><h2 class="text-lg font-semibold text-gray-100 mb-3">Resumen Financiero</h2><ul class="text-gray-300 space-y-1"><li class="flex justify-between"><span>Gastos SSO, adm y util ${ssrInterpolate(unref(formulario).utilidadPorcentaje || 20)}%</span><span>$ ${ssrInterpolate(formatNumber((_h = unref(formulario).resumenFinanciero) == null ? void 0 : _h.gastosSSO))}</span></li><li class="flex justify-between"><span>Neto</span><span>$ ${ssrInterpolate(formatNumber((_i = unref(formulario).resumenFinanciero) == null ? void 0 : _i.neto))}</span></li><li class="flex justify-between"><span>IVA (19%)</span><span>$ ${ssrInterpolate(formatNumber((_j = unref(formulario).resumenFinanciero) == null ? void 0 : _j.iva))}</span></li><li class="flex justify-between font-bold border-t border-gray-600 pt-2 text-gray-100"><span>TOTAL</span><span>$ ${ssrInterpolate(formatNumber((_k = unref(formulario).resumenFinanciero) == null ? void 0 : _k.totalFinal))}</span></li></ul></div></div>`);
      } else {
        _push(`<div class="text-center text-gray-400">Cargando información...</div>`);
      }
      _push(`</main><div class="max-w-5xl mx-auto p-6 flex justify-end"><button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"${ssrIncludeBooleanAttr(!unref(formulario)) ? " disabled" : ""}> Exportar a PDF </button></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/verformulario/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-BpnIkPqR.js.map
