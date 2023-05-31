<script>
	import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';

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
		height: 100%;
		width: 100%;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.column-content {
        height: 385px;
        /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
        overflow-y: scroll;
    }
    @font-face {
      font-family: 'Roboto';
      src: url("https://fonts.googleapis.com/css2?family=Roboto&display=swap") format("woff");
    }
    
    .column-title {
				height: 1.5em;
        font-family: 'Roboto', sans-serif;
        font-weight: 100;
        color: #000000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.7em;
        font-weight: 200;
        user-select: none;
        margin: 10px auto;
    }
    .card {
      position: relative;
      height: 2em;
      width: 190px;
      margin: 0.2em 0;
      padding: 1.5em 1em;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #dddddd;
      border: 1px solid #333333 ;
      font-family: 'Roboto', sans-serif;
      font-weight: 100;
      color: #000000;
    }

    .wide {
      width: 255px !important;
    }
    
    .toolbox {
      margin-left: 0px !important;
    }
    .buttons {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
    }
    .leftbutton {
      width: 70px;
      height: 3em;
      position: absolute;
      left:0;
      top:0;
    }
    .rightbutton {
      width: 70px;
      height: 3em;
      position: absolute;
      right:0;
      top:0;
    }

    .rightbutton button {
      padding: 0;
      width: 20px;
      height: 60%;
      position: absolute;
      top: 20%;
      right: 5%;
      /* background-color: #dddddd;
      border: 0.5px gray solid; */
    }

    .leftbutton button {
      padding: 0;
      width: 20px;
      height: 60%;
      position: absolute;
      background-color: none;
      top: 20%;
      left: 5%;
      /* background-color: #dddddd;
      border: 0.5px gray solid; */
    }

    .hide {
      display: none;
    }
    .selectRepeat {
      position: absolute;
      top: 12px;
      left: 78px;
    }
    .selectDirect {
      width: 34px;
    }

    .wideSelect {
      left: 111px !important;
    }

    .smallText {
      font-size: 15px;
    }

</style>
<div class='wrapper' class:program="{name==='program'}">
 	<div class="column-title">
		{name}
	</div>
	<div class="column-content" use:dndzone={{items, flipDurationMs, zoneTabIndex: -1}}
     	 on:consider={handleDndConsiderCards} 
			 on:finalize={handleDndFinalizeCards}>
				{#each items as item, i (item.id)}

           <div class="card" animate:flip="{{duration: flipDurationMs}}" style="margin-left: {item.indent}px;" class:toolbox="{name==='toolbox'}" class:wide={level>=3} class:selected={stepIndex==i && name==='program'}>
            <div class="buttons">
              <div class="leftbutton" style="font-weight: 900;" on:click={toggleIndentDown(item)} class:hide={level == 0 || (item.name=="repeat ____ times:" && level == 1)}>
                <button> {'<'} </button>
              </div>
              <div class="selectRepeat" class:wideSelect={level>=3} class:hide={level == 0 || item.name!="repeat ____ times:"}>
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
              <div class="rightbutton" style="font-weight: 900;" on:click={toggleIndent(item)} class:hide={level == 0 || (item.name=="repeat ____ times:" && level == 1)}>
                <button> {'>'} </button>
              </div>
            </div>
            <div class="name" class:smallText="{level==3}">
              {item.name}
            </div>
              
            </div>
        {/each}
    </div>
</div>
