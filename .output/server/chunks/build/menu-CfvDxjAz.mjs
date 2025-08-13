import { _ as __nuxt_component_0 } from './nuxt-link-Dh6CM9v3.mjs';
import { useSSRContext, mergeProps, withCtx, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-950 text-gray-200" }, _attrs))}><div class="bg-gray-900 rounded-lg shadow-lg p-10 w-full max-w-md space-y-6 text-center"><h1 class="text-3xl font-semibold mb-4">Men\xFA Principal</h1>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/formulario",
    class: "block w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 rounded-md transition font-medium"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Crear Formulario `);
      } else {
        return [
          createTextVNode(" Crear Formulario ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/historial",
    class: "block w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 rounded-md transition font-medium"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Ver Historial `);
      } else {
        return [
          createTextVNode(" Ver Historial ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/ClienteCreate",
    class: "block w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 rounded-md transition font-medium"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Crear Clientes `);
      } else {
        return [
          createTextVNode(" Crear Clientes ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/menu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const menu = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { menu as default };
//# sourceMappingURL=menu-CfvDxjAz.mjs.map
