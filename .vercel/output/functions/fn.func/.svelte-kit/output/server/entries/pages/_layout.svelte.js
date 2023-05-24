import { c as create_ssr_component, e as escape, v as validate_component } from "../../chunks/index2.js";
/* empty css                   */import { b as base } from "../../chunks/paths.js";
const Nav_svelte_svelte_type_style_lang = "";
const css = {
  code: "nav.svelte-1w5dgbk ul.svelte-1w5dgbk{list-style:none;padding:3px 5px;background:#5027f2}a.svelte-1w5dgbk.svelte-1w5dgbk{color:#fff;text-decoration:none}li.svelte-1w5dgbk.svelte-1w5dgbk{display:inline}",
  map: null
};
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<nav class="svelte-1w5dgbk"><ul class="svelte-1w5dgbk"><li class="svelte-1w5dgbk"><a href="${escape(base, true) + "/"}" class="svelte-1w5dgbk">Home</a></li>
      <li class="svelte-1w5dgbk"><a href="${escape(base, true) + "/level0/"}" class="svelte-1w5dgbk">Level 0</a></li></ul>
</nav>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}


${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
