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
    position: relative;
    /* padding: 10px; */
    gap: 10px;
    width: 100%;
    height: 100%;
    min-height: 420px;
	}
  .contentWrap {
    
  }
  .longCol {
    height: 400px !important;
  }

	.column-content {
        /* height: 100%; */
        height: 335px;

        min-width: 230px;
        /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        padding-bottom: 50px;
        gap: 5px;

        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 0;
        z-index: 1;
    }

    .colTool {
      height: 100% !important;
    }
    
    .column-title {
      width: 92px;
      height: 28px;

      /* Web/Mobile/H3/Default */

      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: 100;
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
      padding: 0px;
    }

    .leftbutton button {
      width: 20px;
      height: 20px;
      border-radius: 2.5px;
      position: absolute;
      background-color: none;
      left: 5px;
      top: 7.5px;
      border-radius: 2.5px;
      padding: 0px;

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
      position: absolute;
      bottom: 10px;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
      padding: 0 10px;
      gap: 5px;
      flex-wrap: wrap;

      width: 150px;
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
      align-items: baseline;

      /* Grayscale/Black */
      order: 0;
      color: #000000;
    }

    .numSteps {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 12px;
      line-height: 14px;
      /* identical to box height */

      display: flex;
      align-items: baseline;
      order: 1;
      /* Grayscale/Black */

      color: #000000;
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

    @media (640px < width < 1000px) {
      .column-content {
        min-height: 210px;
        max-height: 210px;
        margin-bottom: 50px;
      }
      .wrapper {
        min-height: 230px;
        min-height: 230px;
      }
      .wrapperLong {
        min-height: 240px;
        min-height: 240px;
      }
      .colTool {
        max-height: 350px !important;
        padding-bottom: 0px;
        margin-bottom: 0px;
        /* height: 100% !important; */
      }
    }

    @media (max-width: 640px) {
      .column-content {
        min-height: 110px;
        max-height: 170px;
        margin-bottom: 50px;
        justify-content: left;
        min-width: 170px;
        /* width: 100px !important; */
        overflow-x: scroll;
      }
      
      .wrapper {
        min-height: 130px;
        min-height: 130px;
        overflow-x: scroll;
      }
      
      .colTool {
        max-height: 450px !important;
        padding-bottom: 0px;
        margin-bottom: 0px;
        /* height: 100% !important; */
      }
      .name {
        font-size: 10px;
      }
      .card {
        padding: 5px 35px;
        height: min-content;
        justify-content: left;
        /* width: min-content; */
      }
      .toolbox {
        padding: 5px 5px !important;
      }
      .selectRepeat {
        position: absolute;
        top: 3px;
        left: 39%;
      }
      .selectDirect {
        width: 33px;
        font-size: 10px;
      }
      .leftbutton {
        height: 27px;

      }
      .leftbutton button {
        top: 4px;
      }
      .rightbutton button {
        top: 4px;
      }
      .rightbutton {
        height: 27px;
      }
      
    }


</style>
<div class='wrapper' class:program="{name==='Program'}">
 	<div class="column-title">
		{name}
	</div>
  <div class="contentWrap">
	<div class:colTool={name==='Toolbox'} class:wrapperLong={level==3} class:longCol={level==0 || level==4} class="column-content" use:dndzone={{items, flipDurationMs, zoneTabIndex: -1}}
     	 on:consider={handleDndConsiderCards} 
			 on:finalize={handleDndFinalizeCards}>
				{#each items as item, i (item.id)}

           <div class="card" animate:flip="{{duration: flipDurationMs}}" style="margin-left: {item.indent/2}px;" class:toolbox="{name==='Toolbox' || level==0}" class:selected={stepIndex==i && name==='Program'}>
            <div class="buttons">
              <div class="leftbutton" on:click={toggleIndentDown(item)} class:hide={name==='Toolbox' || level == 0 || (item.name.includes("repeat") && level == 1)}>
                <button class:hide={name==='Toolbox'}> <Icon name=3 width="14px" height="9px"/> </button>
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
                <button class:hide={name==='Toolbox'}> <Icon name=4 width="14px" height="9px"/> </button>
              </div>
            </div>
            <!-- <div class="colon" class:hide={!(item.name.includes("repeat")||item.name.startsWith("for")||item.name.includes("if"))}> : </div> -->
            <div class="name">
              {item.name}
            </div>
              
            </div>
        {/each}
    </div>
  </div>
    <div class:hideBottom={name=='Toolbox'} class="bottomBar">
      <div class="numSteps">
        # of Steps: {numSteps}
      </div>
      <div class="numCommands">
        # of Commands: {numCommands}
      </div>
      
      <div class="fakeButton">

      </div>

    </div>
    
</div>
