<script>
	import { flip } from 'svelte/animate';
	import Column from "./Column.svelte";
  import {levelStore} from '../lib/stores.js';
	let level=0;
	levelStore.subscribe(value => {
		level = value;
  });


	const flipDurationMs = 300;
	
  export let columns;
	// will be called any time a card or a column gets dropped to update the parent data
	export let onFinalUpdate;
 
  function handleDndConsiderColumns(e) {
    columns = e.detail.items;
  }
  function handleDndFinalizeColumns(e) {
    onFinalUpdate(e.detail.items);
  }
 	function handleItemFinalize(columnIdx, name, newItems) {
		columns[columnIdx].items = newItems;
    // reset all toolbox items to 0 indent
    let column;
    if (name == "Toolbox") {
      column = columns[columnIdx].items;
      column.forEach(item => {
        item.indent = 0;
      });
    }
		onFinalUpdate([...columns]);
	}
</script>


<section class="board">
  {#each columns as {id, name,items,indents}, idx (id)}
    <div  class:wideToolbox="{level>=3}" class:program="{name==='Program'}" class:wideProgram={level>=3 && name==='Program'} class="column" animate:flip="{{duration: flipDurationMs}}" >    
      <Column name={name} items={items} onDrop={(newItems) => handleItemFinalize(idx, name, newItems)}/>
    </div>
  {/each}

</section>


<style>

  .board {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 10px;
  }

  .column {
      
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px;
      gap: 10px;

      min-width: 250px;
      height: 558px;

      /* Translucent/Grayscale/Black/5% */

      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      

      /* Inside auto layout */

      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 1;

  }

  .program {
      /* width: 100%; */
      min-width: 314px;
      /* max-width: 500px !important; */
    }

    /* .wideProgram {
      min-width: 380px !important;
      max-width: 795px !important;
    } */

    /* .wideToolbox {
      width: 280px !important;
    } */

    
</style>
