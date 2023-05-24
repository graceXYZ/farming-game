import { c as create_ssr_component, b as each, e as escape, d as add_attribute, v as validate_component } from "../../chunks/index2.js";
/* empty css                   */import { c as charSelectStore, I as Icon } from "../../chunks/stores.js";
const SignIn_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".wrap.svelte-fijtyj{width:500px;margin:1em 1em;padding:1em;background-color:rgb(246, 246, 246)    \n    }.iconWrap.svelte-fijtyj{position:absolute;left:5px;top:10px}.hidden.svelte-fijtyj{display:none}.selected.svelte-fijtyj{border:1px blue solid;background-color:rgb(255, 0, 0) !important}.selectOption.svelte-fijtyj{position:relative;padding:10px;width:120px;height:120px;background-color:rgb(255, 99, 99)}button.svelte-fijtyj{margin:5px;border:black 0.5px solid}.charSelect.svelte-fijtyj{display:flex;flex-wrap:wrap;width:450px}",
  map: null
};
const SignIn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let charOptions = ["femaleWhite", "teacher", "maleBrown"];
  let selected = data.character;
  let defaultName = data.name;
  charSelectStore.subscribe((value) => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$1);
  {
    {
      console.log(data.character);
      charSelectStore.update((n) => charOptions[data.character]);
    }
  }
  return `<div class="wrap svelte-fijtyj"><h2>Choose your character!</h2>
<div class="charSelect svelte-fijtyj">${each(charOptions, (val, idx) => {
    return `<button class="${["selectOption svelte-fijtyj", selected == idx ? "selected" : ""].join(" ").trim()}"><div class="iconWrap svelte-fijtyj">${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        name: val,
        width: "100px",
        height: "100px",
        class: "large"
      },
      {},
      {}
    )}</div>
        </button>`;
  })}</div>

<h2 style="margin-top:1em">Type your name!</h2>

<form method="POST" action="?/signIn"><div style="display:flex"><input style="margin-left: 5px; height:30px; font-size:20px" type="name" name="name">
        <p style="margin-left:10px">${escape(defaultName)}</p></div>
    <input class="hidden svelte-fijtyj" type="character" name="character"${add_attribute("value", selected, 0)}>
    <button style="margin-top: 2em" type="submit" class="svelte-fijtyj">Submit</button></form>

</div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".hide.svelte-1dadjpq{display:none}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<h1 style="margin:1em; text-align: center" class="${["svelte-1dadjpq", data.visited != "true" ? "hide" : ""].join(" ").trim()}">Hello ${escape(data.name)}! You chose character ${escape(data.character)}</h1>

${validate_component(SignIn, "SignIn").$$render($$result, { data }, {}, {})}`;
});
export {
  Page as default
};
