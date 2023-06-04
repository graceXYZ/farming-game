<script>
	import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';

  import Icon from '../lib/Icon.svelte'

  import { repCountsStore} from '../lib/stores.js';

  import { stepI } from '../lib/stores.js';
  let stepIndex = -1;
    stepI.subscribe(value => {
      stepIndex = value;
    });
  
  import {levelStore} from '../lib/stores.js';
	let level=0;
	levelStore.subscribe(value => {
		level = value;
  });

  import {numStepsStore} from '../lib/stores.js';
	let numSteps=0;
	numStepsStore.subscribe(value => {
		numSteps = value;
  });

  import {numCommandsStore} from '../lib/stores.js';
	let numCommands=0;
	numCommandsStore.subscribe(value => {
		numCommands = value;
  });

  const flipDurationMs = 150;

  let answer = '';

	export let name;
	export let items;
	export let onDrop;

  let repValues = [];

  function handleRepSelect(i){
    console.log("CHANGE REP")
    console.log(items[i])
    onDrop(items);
  }
  
	
	function handleDndConsiderCards(e) {
		items = e.detail.items;
    }
  function handleDndFinalizeCards(e) {
    onDrop(e.detail.items);
  }

  function toggleIndentDown(item){
    console.log("DECR")
    if (item.indent >= 50) {
      item.indent -= 50;
    }
    item = item;
    onDrop(items);
  }

  function toggleIndent(item){
    console.log("INCREASE")
    if (item.indent <= 50*2) {
      item.indent += 50;
    }
    item = item;
    onDrop(items);
  }


</script>
<style>
  .selected {
    background-color: #c9c9ab !important;
  }

	.wrapper {
	  overflow-y: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* padding: 10px; */
    gap: 10px;
    /* width: 100%;
    height: 100%; */
	}
	.column-content {
        height: 464px;
        min-width: 250px;
        /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 5px;

        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 0;
        z-index: 1;
    }
    
    .column-title {
      width: 92px;
      height: 28px;

      /* Web/Mobile/H3/Default */

      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: 300;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: center;

      /* Grayscale/Black */

      color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;

				/* height: 1.5em;
        font-family: 'Roboto', sans-serif;
        font-weight: 100;
        color: #000000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.7em;
        font-weight: 200;
        user-select: none;
        margin: 10px auto; */

    }

    .card {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 7.5px 35px;
      gap: 5px;
      position: relative;

      font-size: 14px;

      /* width: 276px; */
      /* min-width: 155px; */
      height: 32px;
      text-align: center;

      /* Grayscale/Gray 4 */

      background: #E5E5E5;
      border-radius: 5px;

      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;

      /* height: 2em;
      width: 190px;
      margin: 0.2em 0;
      padding: 1.5em 1em;
      display: flex;
      padding-left: 35px;
      justify-content: left;
      align-items: center;
      background-color: #dddddd;
      border: 1px solid #333333 ;
      font-family: 'Roboto', sans-serif;
      font-weight: 100;
      color: #000000; */
    }

    .name {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;
      padding: 0px;
      gap: 2px;

      height: 17px;

      font-family: 'Fira Code', monospace;
      font-weight: 300;
      color: #000000;
      font-size: 14px;
      line-height: 18px;
      display: flex;
      align-items: center;


      /* Inside auto layout */

      flex: none;
      order: 1;
      flex-grow: 0;
    }

    /* .wide {
      width: 255px !important;
    } */
    
    .toolbox {
      margin-left: 0px !important;
      padding: 7.5px 5px !important;
    }

    .buttons {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
    }
    .leftbutton {
      width: 40%;
      height: 35px;
      position: absolute;
      left:0;
      top:0;
      display: flex;
      justify-content: left;
      align-items: center;
    }
    .rightbutton {
      width: 40%;
      height: 35px;
      position: absolute;
      right: 0;
      top: 0;
    }

    .rightbutton button {
      width: 20px;
      height: 20px;
      border-radius: 2.5px;
      position: absolute;
      background-color: none;
      right: 5px;
      top: 7.5px;
      border-radius: 2.5px;
      padding: 0px 6px 0px 5px;
    }

    .leftbutton button {
      width: 20px;
      height: 20px;
      border-radius: 2.5px;
      position: absolute;
      background-color: none;
      height: 20px;
      width: 20px;
      left: 5px;
      top: 7.5px;
      border-radius: 2.5px;
      padding: 0px 6px 0px 5px;

    }

    .hide {
      display: none;
    }
    .selectRepeat {
      position: absolute;
      top: 6.5px;
      left: 88px;
    }
    .selectDirect {
      width: 44px;
    }

    /* .wideSelect {
      left: 81px !important;
    } */

    .smallText {
      font-size: 15px;
    }

    .colon {
      position: absolute;
      top: -4px;
      right: -11px;
      font-size: 35px;
      font-weight: 900;
      color: gray;
    }

    .bottomBar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0px;
      gap: 10px;

      width: 294px;
      height: 26px;
      /* Inside auto layout */

      flex: none;
      order: 2;
      align-self: stretch;
      flex-grow: 0;
    }

    .numCommands {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 12px;
      line-height: 14px;
      /* identical to box height */

      display: flex;
      align-items: center;

      /* Grayscale/Black */

      color: #000000;


      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;
    }

    .numSteps {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 12px;
      line-height: 14px;
      /* identical to box height */

      display: flex;
      align-items: center;

      /* Grayscale/Black */

      color: #000000;


      /* Inside auto layout */

      flex: none;
      order: 1;
      flex-grow: 0;
    }
    .fakeButton {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;
      
      width: 88px;
      height: 26px;

      /* Grayscale/White */

      background: none;
      border-radius: 2.5px;

      /* Inside auto layout */

      flex: none;
      order: 2;
      flex-grow: 0;
    }

    .hideBottom {
      display: none;
    }


</style>
<div class='wrapper' class:program="{name==='Program'}">
 	<div class="column-title">
		{name}
	</div>
	<div class="column-content" use:dndzone={{items, flipDurationMs, zoneTabIndex: -1}}
     	 on:consider={handleDndConsiderCards} 
			 on:finalize={handleDndFinalizeCards}>
				{#each items as item, i (item.id)}

           <div class="card" animate:flip="{{duration: flipDurationMs}}" style="margin-left: {item.indent}px;" class:toolbox="{name==='Toolbox'}" class:selected={stepIndex==i && name==='Program'}>
            <div class="buttons">
              <div class="leftbutton" on:click={toggleIndentDown(item)} class:hide={name==='Toolbox' || level == 0 || (item.name.includes("repeat") && level == 1)}>
                <button class:hide={name==='Toolbox'}> <Icon name=3 width="20px" height="20px"/> </button>
              </div>
              <div class="selectRepeat" class:hide={name==='Toolbox' || level == 0 || !item.name.includes("repeat")}>
                <select class="selectDirect" bind:value={item.repeat} on:change="{handleRepSelect(i)}">
                  <option value=1>
                    {1}
                  </option>
                  <option value=2>
                    {2}
                  </option>
                  <option value=3>
                    {3}
                  </option>
                  <option value=4>
                    {4}
                  </option>
                  <option value=5>
                    {5}
                  </option>
                  <option value=6>
                    {6}
                  </option>
                  <option value=7>
                    {7}
                  </option>
                  <option value=8>
                    {8}
                  </option>
                  <option value=9>
                    {9}
                  </option>
                  <option value=10>
                    {10}
                  </option>
                </select>
              </div>
              <div class="rightbutton" style="font-weight: 900;" on:click={toggleIndent(item)} class:hide={level == 0 || (item.name.includes("repeat") && level == 1)}>
                <button class:hide={name==='Toolbox'}> <Icon name=4 width="20px" height="20px"/> </button>
              </div>
            </div>
            <!-- <div class="colon" class:hide={!(item.name.includes("repeat")||item.name.startsWith("for")||item.name.includes("if"))}> : </div> -->
            <div class="name" class:smallText="{level==3}">
              {item.name}
            </div>
              
            </div>
        {/each}
    </div>
    <div class:hideBottom={name=='Toolbox'} class="bottomBar">
      <div class="numCommands">
        # of Commands: {numCommands}
      </div>
      <div class="numSteps">
        # of Steps: {numSteps}
      </div>
      <div class="fakeButton">

      </div>

    </div>
</div>
