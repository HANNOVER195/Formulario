import { withAsyncContext, unref, computed, toValue, getCurrentInstance, onServerPrefetch, ref, shallowRef, toRef, nextTick, defineComponent, createElementBlock, provide, cloneVNode, h, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { a as useNuxtApp, d as asyncDataDefaults, e as createError } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const firebaseConfig = {
  apiKey: "AIzaSyCyuvVV7EHgSxFgUiI4p4wGuzQ-dYOGabE",
  authDomain: "prac-form-21f1f.firebaseapp.com",
  projectId: "prac-form-21f1f",
  storageBucket: "prac-form-21f1f.firebasestorage.app",
  messagingSenderId: "589176319025",
  appId: "1:589176319025:web:81ef061164544be0fef910",
  measurementId: "G-9FMEH1SXXG"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const DEBOUNCE_DEFAULTS = {
  trailing: true
};
function debounce(fn, wait = 25, options = {}) {
  options = { ...DEBOUNCE_DEFAULTS, ...options };
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }
  let leadingValue;
  let timeout;
  let resolveList = [];
  let currentPromise;
  let trailingArgs;
  const applyFn = (_this, args) => {
    currentPromise = _applyPromised(fn, _this, args);
    currentPromise.finally(() => {
      currentPromise = null;
      if (options.trailing && trailingArgs && !timeout) {
        const promise = applyFn(_this, trailingArgs);
        trailingArgs = null;
        return promise;
      }
    });
    return currentPromise;
  };
  return function(...args) {
    if (currentPromise) {
      if (options.trailing) {
        trailingArgs = args;
      }
      return currentPromise;
    }
    return new Promise((resolve) => {
      const shouldCallNow = !timeout && options.leading;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        const promise = options.leading ? leadingValue : applyFn(this, args);
        for (const _resolve of resolveList) {
          _resolve(promise);
        }
        resolveList = [];
      }, wait);
      if (shouldCallNow) {
        leadingValue = applyFn(this, args);
        resolve(leadingValue);
      } else {
        resolveList.push(resolve);
      }
    });
  };
}
async function _applyPromised(fn, _this, args) {
  return await fn.apply(_this, args);
}

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
  var _a2, _b, _c, _d, _e, _f, _g;
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
  (_a2 = options.server) != null ? _a2 : options.server = true;
  (_b = options.default) != null ? _b : options.default = getDefault;
  (_c = options.getCachedData) != null ? _c : options.getCachedData = getDefaultCachedData;
  (_d = options.lazy) != null ? _d : options.lazy = false;
  (_e = options.immediate) != null ? _e : options.immediate = true;
  (_f = options.deep) != null ? _f : options.deep = asyncDataDefaults.deep;
  (_g = options.dedupe) != null ? _g : options.dedupe = "cancel";
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
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.data;
    }),
    pending: writableComputedRef(() => {
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.pending;
    }),
    status: writableComputedRef(() => {
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.status;
    }),
    error: writableComputedRef(() => {
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.error;
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
  var _a2;
  var _a;
  (_a2 = (_a = nuxtApp.payload._errors)[key]) != null ? _a2 : _a[key] = asyncDataDefaults.errorValue;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
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
      var _a3, _b2;
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer((_a3 = opts.dedupe) != null ? _a3 : options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: (_b2 = opts.cause) != null ? _b2 : "refresh:manual" });
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
      var _a22;
      unsubRefreshAsyncData();
      if ((_a22 = nuxtApp._asyncData[key]) == null ? void 0 : _a22._init) {
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
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h, _i, _j, _k, _l, _m, _n, _o;
      var _a, _b, _c, _d, _e, _f, _g;
      const toISO = (ts) => (ts == null ? void 0 : ts.toDate) ? ts.toDate().toISOString() : ts != null ? ts : null;
      return {
        ...data,
        // Mantener los nombres que estás usando en el formulario / DB
        companyName: (_a2 = data.companyName) != null ? _a2 : "",
        attentionName: (_b2 = data.attentionName) != null ? _b2 : "",
        emailName: (_c2 = data.emailName) != null ? _c2 : "",
        // <-- usar el mismo nombre que guardas
        contacName: (_d2 = data.contacName) != null ? _d2 : "",
        // <-- idem (phone quedó guardado como contacName)
        createdAt: toISO(data.createdAt),
        descripcion: (_e2 = data.descripcion) != null ? _e2 : "",
        detalles: (_f2 = data.detalles) != null ? _f2 : "",
        textSections: (_g2 = (_a = data.textSections) == null ? void 0 : _a.map((section) => {
          var _a3;
          return {
            content: (_a3 = section.content) != null ? _a3 : ""
          };
        })) != null ? _g2 : [],
        sections: (_h = (_b = data.sections) == null ? void 0 : _b.map((section) => {
          var _a3, _b3, _c3;
          var _a22;
          return {
            title: (_a3 = section.title) != null ? _a3 : "",
            totalSection: (_b3 = section.totalSection) != null ? _b3 : 0,
            fields: (_c3 = (_a22 = section.fields) == null ? void 0 : _a22.map((field) => {
              var _a4, _b4, _c4, _d3, _e3;
              return {
                label: (_a4 = field.label) != null ? _a4 : "",
                unit: (_b4 = field.unit) != null ? _b4 : "",
                unitPrice: (_c4 = field.unitPrice) != null ? _c4 : 0,
                quantity: (_d3 = field.quantity) != null ? _d3 : 0,
                total: (_e3 = field.total) != null ? _e3 : 0
              };
            })) != null ? _c3 : []
          };
        })) != null ? _h : [],
        totalPorSeccion: (_i = data.totalPorSeccion) != null ? _i : [],
        totalGeneral: (_j = data.totalGeneral) != null ? _j : 0,
        utilidadPorcentaje: (_k = data.utilidadPorcentaje) != null ? _k : 20,
        // <-- lo lees directo de data
        resumenFinanciero: {
          gastosSSO: (_l = (_c = data.resumenFinanciero) == null ? void 0 : _c.gastosSSO) != null ? _l : 0,
          neto: (_m = (_d = data.resumenFinanciero) == null ? void 0 : _d.neto) != null ? _m : 0,
          iva: (_n = (_e = data.resumenFinanciero) == null ? void 0 : _e.iva) != null ? _n : 0,
          totalFinal: (_o = (_f = data.resumenFinanciero) == null ? void 0 : _f.totalFinal) != null ? _o : 0,
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
      _push(`<!--[--><button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition m-5"> Volver al historial </button><main class="max-w-5xl mx-auto p-6 rounded-lg shadow-lg" style="${ssrRenderStyle({ backgroundColor: "#1a202c", color: "#e2e8f0" })}"><h1 class="text-3xl font-bold mb-4 text-gray-200">${ssrInterpolate(((_a = unref(formulario)) == null ? void 0 : _a.name) || "Formulario")}</h1><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-6 text-sm text-gray-300"><p><strong>Empresa:</strong> ${ssrInterpolate(((_b = unref(formulario)) == null ? void 0 : _b.companyName) || "-")}</p><p><strong>Atenci\xF3n a:</strong> ${ssrInterpolate(((_c = unref(formulario)) == null ? void 0 : _c.attentionName) || "-")}</p><p><strong>Email:</strong> ${ssrInterpolate(((_d = unref(formulario)) == null ? void 0 : _d.emailName) || "-")}</p><p><strong>Tel\xE9fono:</strong> ${ssrInterpolate(((_e = unref(formulario)) == null ? void 0 : _e.contacName) || "-")}</p><p><strong>Fecha de creaci\xF3n:</strong> ${ssrInterpolate(formatDate((_f = unref(formulario)) == null ? void 0 : _f.createdAt))}</p></div>`);
      if (unref(formulario)) {
        _push(`<div>`);
        if (unref(formulario).descripcion || unref(formulario).detalles) {
          _push(`<div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4"><h2 class="text-lg font-semibold text-gray-100 mb-2">Detalles del formulario</h2>`);
          if (unref(formulario).descripcion) {
            _push(`<p class="mb-2"><strong>Descripci\xF3n:</strong> ${ssrInterpolate(unref(formulario).descripcion)}</p>`);
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
            _push(`<div class="mb-2"><p class="text-gray-300">\u{1F4CC} ${ssrInterpolate(text.content)}</p></div>`);
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
          _push(`<!--]--></tbody></table><div class="text-right font-semibold text-gray-200"> Total secci\xF3n: $${ssrInterpolate(formatNumber(section.totalSection))}</div></div>`);
        });
        _push(`<!--]--><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4"><h2 class="text-lg font-semibold text-gray-100 mb-3">Total de servicio</h2><ul class="text-gray-300 space-y-1"><!--[-->`);
        ssrRenderList(unref(formulario).totalPorSeccion, (total, index) => {
          var _a2;
          _push(`<li class="flex justify-between"><span>${ssrInterpolate(((_a2 = unref(formulario).sections[index]) == null ? void 0 : _a2.title) || `Secci\xF3n ${index + 1}`)}</span><span>$ ${ssrInterpolate(formatNumber(total))}</span></li>`);
        });
        _push(`<!--]--></ul><div class="mt-2 text-right font-bold text-lg text-gray-100 border-t border-gray-600 pt-2"> SUBTOTALES: $${ssrInterpolate(formatNumber(unref(formulario).totalGeneral))}</div></div><div class="bg-gray-800 border border-gray-700 rounded p-4 mb-4"><h2 class="text-lg font-semibold text-gray-100 mb-3">Resumen Financiero</h2><ul class="text-gray-300 space-y-1"><li class="flex justify-between"><span>Gastos SSO, adm y util ${ssrInterpolate(unref(formulario).utilidadPorcentaje || 20)}%</span><span>$ ${ssrInterpolate(formatNumber((_h = unref(formulario).resumenFinanciero) == null ? void 0 : _h.gastosSSO))}</span></li><li class="flex justify-between"><span>Neto</span><span>$ ${ssrInterpolate(formatNumber((_i = unref(formulario).resumenFinanciero) == null ? void 0 : _i.neto))}</span></li><li class="flex justify-between"><span>IVA (19%)</span><span>$ ${ssrInterpolate(formatNumber((_j = unref(formulario).resumenFinanciero) == null ? void 0 : _j.iva))}</span></li><li class="flex justify-between font-bold border-t border-gray-600 pt-2 text-gray-100"><span>TOTAL</span><span>$ ${ssrInterpolate(formatNumber((_k = unref(formulario).resumenFinanciero) == null ? void 0 : _k.totalFinal))}</span></li></ul></div></div>`);
      } else {
        _push(`<div class="text-center text-gray-400">Cargando informaci\xF3n...</div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=_id_-BpnIkPqR.mjs.map
