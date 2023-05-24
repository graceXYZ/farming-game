import { c as create_ssr_component, e as escape, b as each, v as validate_component } from "../../../chunks/index2.js";
import { s as stepI, l as levelStore, i as indentsStore, a as steps, c as charSelectStore, r as repCountsStore, I as Icon, f as feedback } from "../../../chunks/stores.js";
function resetIndexesCache() {
  /* @__PURE__ */ new Map();
}
resetIndexesCache();
/* @__PURE__ */ new Map();
/* @__PURE__ */ new Map();
/* @__PURE__ */ new WeakMap();
/* @__PURE__ */ new WeakSet();
/* @__PURE__ */ new WeakMap();
/* @__PURE__ */ new WeakMap();
/* @__PURE__ */ new Map();
/* @__PURE__ */ new Map();
/* @__PURE__ */ new Map();
const Column_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: `.selected.svelte-1jb2xq7{background-color:#c9c9ab !important}.wrapper.svelte-1jb2xq7{height:100%;width:100%;overflow-y:hidden}.column-content.svelte-1jb2xq7{height:350px;overflow-y:scroll}@font-face{font-family:'Roboto';src:url("https://fonts.googleapis.com/css2?family=Roboto&display=swap") format("woff")}.column-title.svelte-1jb2xq7{height:1.5em;font-family:'Roboto', sans-serif;font-weight:100;color:#000000;display:flex;justify-content:center;align-items:center;font-size:1.7em;font-weight:200;user-select:none;margin:10px auto}.card.svelte-1jb2xq7{position:relative;height:2em;width:180px;margin:0.2em 0;padding:1.5em 1em;display:flex;justify-content:center;align-items:center;background-color:#dddddd;border:1px solid #333333 ;font-family:'Roboto', sans-serif;font-weight:100;color:#000000}.toolbox.svelte-1jb2xq7{margin-left:0px !important}.buttons.svelte-1jb2xq7{top:0;left:0;position:absolute;display:flex}.leftbutton.svelte-1jb2xq7{width:90px;height:3em;padding:0.5em 1em;margin:0;text-align:left}.rightbutton.svelte-1jb2xq7{width:90px;height:3em;padding:0.5em 1em;margin:0;text-align:right}.hide.svelte-1jb2xq7{display:none}.selectRepeat.svelte-1jb2xq7{position:absolute;top:12px;left:74px}.selectDirect.svelte-1jb2xq7{width:34px}`,
  map: null
};
const Column = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let stepIndex = -1;
  stepI.subscribe((value) => {
    stepIndex = value;
  });
  let level = 0;
  levelStore.subscribe((value) => {
    level = value;
  });
  let { name } = $$props;
  let { items } = $$props;
  let { onDrop } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.onDrop === void 0 && $$bindings.onDrop && onDrop !== void 0)
    $$bindings.onDrop(onDrop);
  $$result.css.add(css$5);
  return `<div class="${["wrapper svelte-1jb2xq7", name === "program" ? "program" : ""].join(" ").trim()}"><div class="column-title svelte-1jb2xq7">${escape(name)}</div>
	<div class="column-content svelte-1jb2xq7">${each(items, (item, i) => {
    return `<div class="${[
      "card svelte-1jb2xq7",
      (name === "toolbox" ? "toolbox" : "") + " " + (stepIndex == i && name === "program" ? "selected" : "")
    ].join(" ").trim()}" style="${"margin-left: " + escape(item.indent, true) + "px;"}"><div class="buttons svelte-1jb2xq7"><div class="${[
      "leftbutton svelte-1jb2xq7",
      level == 0 || item.name == "repeat ____ times:" ? "hide" : ""
    ].join(" ").trim()}" style="font-weight: 900;">${escape("<")}</div>
              <div class="${[
      "selectRepeat svelte-1jb2xq7",
      level == 0 || item.name != "repeat ____ times:" ? "hide" : ""
    ].join(" ").trim()}"><select class="selectDirect svelte-1jb2xq7"><option value="1">${escape(1)}
                  </option><option value="2">${escape(2)}
                  </option><option value="3">${escape(3)}
                  </option><option value="4">${escape(4)}
                  </option><option value="5">${escape(5)}
                  </option></select></div>
              <div class="${[
      "rightbutton svelte-1jb2xq7",
      level == 0 || item.name == "repeat ____ times:" ? "hide" : ""
    ].join(" ").trim()}" style="font-weight: 900;">${escape(">")}
              </div></div>
            <div class="name">${escape(item.name)}</div>
              
            </div>`;
  })}</div></div>`;
});
const Board_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: `.board.svelte-2ehquc{display:flex}.column.svelte-2ehquc{height:400px;width:200px;padding:0.5em;margin:0.5em;float:left;background-color:rgb(245, 245, 245)}.program.svelte-2ehquc{width:100%;min-width:300px;max-width:350px !important}@font-face{font-family:'Roboto';src:url("https://fonts.googleapis.com/css2?family=Roboto&display=swap") format("woff")}`,
  map: null
};
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { columns } = $$props;
  let { onFinalUpdate } = $$props;
  function handleItemFinalize(columnIdx, name, newItems) {
    columns[columnIdx].items = newItems;
    let column;
    if (name == "toolbox") {
      column = columns[columnIdx].items;
      column.forEach((item) => {
        item.indent = 0;
      });
    }
    onFinalUpdate([...columns]);
  }
  if ($$props.columns === void 0 && $$bindings.columns && columns !== void 0)
    $$bindings.columns(columns);
  if ($$props.onFinalUpdate === void 0 && $$bindings.onFinalUpdate && onFinalUpdate !== void 0)
    $$bindings.onFinalUpdate(onFinalUpdate);
  $$result.css.add(css$4);
  return `<section class="board svelte-2ehquc">${each(columns, ({ id, name, items, indents }, idx) => {
    return `<div class="${["column svelte-2ehquc", name === "program" ? "program" : ""].join(" ").trim()}">${validate_component(Column, "Column").$$render(
      $$result,
      {
        name,
        items,
        onDrop: (newItems) => handleItemFinalize(idx, name, newItems)
      },
      {},
      {}
    )}
			</div>`;
  })}</section>`;
});
const Draggable_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".together.svelte-7io7y5{display:flex;padding:0;margin:0}*{box-sizing:border-box;margin:0}",
  map: null
};
function formatSteps(items) {
  let steps2 = [];
  items.forEach((element) => {
    let key;
    switch (element.name) {
      case "move_up()":
        key = "u";
        break;
      case "move_down()":
        key = "d";
        break;
      case "move_left()":
        key = "l";
        break;
      case "move_right()":
        key = "r";
        break;
      case "water()":
        key = "w";
        break;
      case "repeat ____ times:":
        key = "repeat";
        break;
    }
    steps2.push(key);
  });
  return steps2;
}
function formatIndents(items) {
  let indentsF = [];
  items.forEach((element) => {
    indentsF.push(element.indent);
  });
  return indentsF;
}
const Draggable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let level = 0;
  let toolboxItems, columnsData;
  toolboxItems = [
    { id: 1, name: "move_left()", indent: 0 },
    { id: 2, name: "move_right()", indent: 0 },
    { id: 3, name: "move_up()", indent: 0 },
    { id: 4, name: "move_down()", indent: 0 },
    { id: 5, name: "water()", indent: 0 }
  ];
  columnsData = [
    {
      id: "c1",
      name: "toolbox",
      items: [
        { id: 1, name: "move_left()", indent: 0 },
        { id: 2, name: "move_right()", indent: 0 },
        { id: 3, name: "move_up()", indent: 0 },
        { id: 4, name: "move_down()", indent: 0 },
        { id: 5, name: "water()", indent: 0 }
      ]
    },
    { id: "c2", name: "program", items: [] }
  ];
  if (level > 0) {
    toolboxItems.push({
      id: 6,
      name: "repeat ____ times:",
      indent: 0
    });
  }
  if (level > 0) {
    columnsData[0].items.push({
      id: 6,
      name: "repeat ____ times:",
      indent: 0
    });
  }
  levelStore.subscribe((value) => {
    level = value;
    handleLevelUpdate();
  });
  function handleLevelUpdate() {
    console.log(" LEVEL UPDATE");
    console.log(level);
    toolboxItems = [
      { id: 1, name: "move_left()", indent: 0 },
      { id: 2, name: "move_right()", indent: 0 },
      { id: 3, name: "move_up()", indent: 0 },
      { id: 4, name: "move_down()", indent: 0 },
      { id: 5, name: "water()", indent: 0 }
    ];
    columnsData = [
      {
        id: "c1",
        name: "toolbox",
        items: [
          { id: 1, name: "move_left()", indent: 0 },
          { id: 2, name: "move_right()", indent: 0 },
          { id: 3, name: "move_up()", indent: 0 },
          { id: 4, name: "move_down()", indent: 0 },
          { id: 5, name: "water()", indent: 0 }
        ]
      },
      { id: "c2", name: "program", items: [] }
    ];
    if (level > 0) {
      toolboxItems.push({
        id: 6,
        name: "repeat ____ times:",
        indent: 0
      });
    }
    if (level > 0) {
      columnsData[0].items.push({
        id: 6,
        name: "repeat ____ times:",
        indent: 0
      });
    }
  }
  function handleBoardUpdated(newColumnsData) {
    console.log("HANDLE UPDATE");
    console.log(newColumnsData);
    for (let i = 0; i < toolboxItems.length; i++) {
      console.log(toolboxItems[i]);
      toolboxItems[i].id += 10;
    }
    newColumnsData[0].items = toolboxItems;
    columnsData = newColumnsData;
    let programData = formatSteps(columnsData[1].items);
    let indentsF = formatIndents(columnsData[1].items);
    indentsStore.update((contents) => indentsF);
    steps.update((contents) => programData);
  }
  $$result.css.add(css$3);
  return `<div class="together svelte-7io7y5">${validate_component(Board, "Board").$$render(
    $$result,
    {
      columns: columnsData,
      onFinalUpdate: handleBoardUpdated
    },
    {},
    {}
  )}
</div>`;
});
const Animation_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: `.hideCell.svelte-ayi5a8{display:none}.characterSVG.svelte-ayi5a8{position:absolute;top:0px;left:0px;width:100%;height:100%}.sapling.svelte-ayi5a8{background-color:rgba(64, 160, 64, 1)}.watered.svelte-ayi5a8{background-color:rgb(37, 86, 37)}:root{--ratioA:1;--ratioB:1}.cell.svelte-ayi5a8{position:relative;display:flex;justify-content:center;align-items:center;border:0.1px black solid}.controls.svelte-ayi5a8{margin:1em auto;display:flex;justify-content:center}.field.svelte-ayi5a8{width:250px;height:250px;margin:0 auto;background-color:rgb(245, 245, 245);position:relative;display:grid}.wrapper.svelte-ayi5a8{position:relative;padding:0.5em;margin:0.5em;width:280px;border:solid black 1px;display:flex;flex-direction:column;flex-wrap:wrap}@font-face{font-family:'Roboto';src:url("https://fonts.googleapis.com/css2?family=Roboto&display=swap") format("woff")}h2.svelte-ayi5a8{text-align:center;font-family:'Roboto', sans-serif;font-weight:100;color:#000000;height:1.5em;display:flex;justify-content:center;align-items:center;font-size:1.7em;user-select:none;margin:10px auto}button.svelte-ayi5a8{font-family:'Roboto', sans-serif;font-weight:100;color:#000000;font-size:1em;margin:0 0.2em;border:0.5px black solid}`,
  map: null
};
const SAPLING_CELL = 0;
const WET_CELL = 1;
const Animation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let charSelect;
  charSelectStore.subscribe((value) => {
    charSelect = value;
  });
  let BOARD_SIZE = 2;
  let level = 0;
  levelStore.subscribe((value) => {
    level = value;
  });
  let widthBoard = 250;
  let rowHeight = widthBoard / BOARD_SIZE;
  let board;
  let boardWater;
  let charPosition;
  stepI.subscribe((value) => {
  });
  steps.subscribe((value) => {
  });
  indentsStore.subscribe((value) => {
  });
  repCountsStore.subscribe((value) => {
  });
  function newGame() {
    board = [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(0));
    boardWater = [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(0));
    charPosition = [0, 0];
  }
  newGame();
  $$result.css.add(css$2);
  {
    {
      console.log("LEVEL CHANGED");
      console.log(level);
      if (level == 0) {
        BOARD_SIZE = 2;
      } else if (level == 1) {
        BOARD_SIZE = 3;
      }
      widthBoard = 250;
      rowHeight = widthBoard / BOARD_SIZE;
      newGame();
    }
  }
  return `<div class="wrapper svelte-ayi5a8"><h2 class="svelte-ayi5a8">field</h2>


  <div class="field svelte-ayi5a8" style="${"grid-template-columns: repeat(" + escape(BOARD_SIZE, true) + ", 1fr); grid-auto-rows: " + escape(rowHeight, true) + ";"}">${each(board, (row, outerIndex) => {
    return `${each(row, (cell, index) => {
      return `<div class="${[
        "cell svelte-ayi5a8",
        (charPosition[0] == outerIndex && charPosition[1] == index ? "character" : "") + " " + (board[outerIndex][index] == SAPLING_CELL ? "sapling" : "") + " " + (boardWater[outerIndex][index] == WET_CELL ? "watered" : "")
      ].join(" ").trim()}">
            
            <div class="${[
        "characterSVG svelte-ayi5a8",
        charPosition[0] != outerIndex || charPosition[1] != index ? "hideCell" : ""
      ].join(" ").trim()}">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          name: charSelect,
          width: "120px",
          height: "120px",
          class: "large"
        },
        {},
        {}
      )}</div>
          </div>`;
    })}`;
  })}</div>

  <div class="controls svelte-ayi5a8"><button class="svelte-ayi5a8">Play</button>
    <button class="svelte-ayi5a8">Restart</button></div>
  

</div>`;
});
const Modal_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".modal-wrapper.svelte-1tox1d6{background-color:rgba(212, 212, 212, 0.9);position:absolute;width:100%;height:100%;top:0;left:0}.modal.svelte-1tox1d6{background-color:white;max-width:800px;height:350px;padding:1rem;position:relative;margin:2em auto}.close.svelte-1tox1d6{float:right;cursor:pointer}.close.svelte-1tox1d6:hover{font-weight:bold}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let shown = true;
  function show() {
    shown = true;
  }
  function hide() {
    shown = false;
  }
  if ($$props.show === void 0 && $$bindings.show && show !== void 0)
    $$bindings.show(show);
  if ($$props.hide === void 0 && $$bindings.hide && hide !== void 0)
    $$bindings.hide(hide);
  $$result.css.add(css$1);
  return `
  
  ${shown ? `<div class="modal-wrapper svelte-1tox1d6"><div class="modal svelte-1tox1d6"><span class="close svelte-1tox1d6">×</span>
        ${slots.default ? slots.default({}) : ``}</div></div>` : ``}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".wrap.svelte-fab0nk.svelte-fab0nk{display:flex;flex-direction:row;position:relative;justify-content:center;flex-wrap:wrap}.ModalText.svelte-fab0nk.svelte-fab0nk{text-align:left;padding:0.5em}.modalButton.svelte-fab0nk.svelte-fab0nk{position:absolute;bottom:0;right:0;margin:1em}.wrapElements.svelte-fab0nk.svelte-fab0nk{display:flex;flex-direction:column;justify-content:center;margin:0;margin-top:2.5em;position:relative}button.svelte-fab0nk.svelte-fab0nk{background-color:white;font-family:'Roboto', sans-serif;font-style:normal;font-weight:100;color:#000000;position:relative;margin:0;border:0.5px black solid}.levelMessage.svelte-fab0nk.svelte-fab0nk,.feedback.svelte-fab0nk.svelte-fab0nk{padding:0.5em;text-align:center;min-width:100px;background-color:rgb(245, 245, 245);border-radius:6px}.feedback.svelte-fab0nk.svelte-fab0nk{text-align:right}.footerWrap.svelte-fab0nk.svelte-fab0nk{margin:0.5em auto;width:800px;max-width:90%;min-width:500px;height:100px;display:grid;gap:15px;align-items:start;grid-template-columns:175px 100px 1fr}.footerWrap.svelte-fab0nk button.svelte-fab0nk{width:175px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let modal;
  levelStore.subscribe((value) => {
  });
  let feedbackThis = "";
  feedback.subscribe((value) => {
    feedbackThis = value;
  });
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<main class="svelte-fab0nk"><div class="wrapElements svelte-fab0nk"><div class="wrap svelte-fab0nk">${validate_component(Draggable, "Draggable").$$render($$result, {}, {}, {})}
            ${validate_component(Animation, "Animation").$$render($$result, {}, {}, {})}</div>
    
      ${validate_component(Modal, "Modal").$$render(
      $$result,
      { this: modal },
      {
        this: ($$value) => {
          modal = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<h2 style="margin-bottom: 0.1em">Welcome to The Sugar Shortage</h2>
        <div class="ModalText svelte-fab0nk"><p>You are visiting a sugar beet farm to help figure out why all the beet plants are dying!</p>
        <p>Your first task is to make sure all the plants are watered.</p>
        <p>Using the toolbox commands on the left, construct a program to move your character around the field and water the plants.</p>
        <br>
        <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to try again. </p>
        <br>
        <p>When all the plants are watered, you can move on to the next level!</p></div>
        <button class="modalButton svelte-fab0nk">Close</button>`;
        }
      }
    )}

      <div class="footerWrap svelte-fab0nk"><button class="svelte-fab0nk">Show instructions</button>
        <div class="levelMessage svelte-fab0nk">Level
    
          <select class="levelSelect"><option value="0">${escape(0)}
            </option><option value="1">${escape(1)}</option></select></div>
        <div class="feedback svelte-fab0nk">${escape(feedbackThis)}</div></div></div>
  
    
    
    
  
    
  
  </main>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
