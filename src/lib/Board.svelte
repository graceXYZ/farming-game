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
    <div  class:program="{name==='Program'}" class:narrow={level<=1} class:middle={level==2 && name==='Program'} class="column" animate:flip="{{duration: flipDurationMs}}" >    
      <Column name={name} items={items} onDrop={(newItems) => handleItemFinalize(idx, name, newItems)}/>
    </div>
  {/each}

</section>


<style>

  .board {
    position: relative;
    display: flex;
    
    padding: 0px;
    gap: 10px;
    width: 100%;
    flex-shrink: 0;
    height: 100%;
  }

  .column {
      grid-row: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px;
      gap: 10px;

      width: 265px;
      max-width: 265px;
      height: 100%;
      /* height: 558px; */

      /* Translucent/Grayscale/Black/5% */

      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      

      /* Inside auto layout */

      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 0;

  }

  .program {
      /* width: 100%; */
      /* width: 100%; */
      min-width: 400px;
      max-width: 530px !important;
    }

    .middle {
      min-width: 324px;
    }

    .narrow {
      min-width: 265px;
    }

    @media (640px <= width <= 1000px) {
      .program {
        min-width: 350px;
      }
    }
    @media (max-width: 640px) {
      .program {
        /* margin-right: 10px; */
        /* margin: 0 10px; */
        /* width: 100% !important; */
      }
      .board{
        /* gap: 10px; */
        display: grid !important;
        grid-template-columns: 2fr 3fr;
        gap: 10px;
        margin: 0;
        display: flex;
        min-width: 50px !important;
        /* width: 100% !important; */
        /* margin-left: 10px; */
        /* padding-right: 20px; */
      }
      
      .column {
        width: 100% !important;
        min-width: 50px !important;
        min-height: 150px;
        /* width: 60%; */
        /* margin-right: 10px; */
        /* width: calc(40%-10px) !important;
        max-width: calc(40%-10px) !important; */
        /* width: 100%;
        min-width: 40%; */
        /* max-width: 600px; */
      }
      .narrow {
        /* width: 40%; */
        min-width: 50px !important;
        /* width: calc(40%-10px) !important;
        min-width: calc(40%-10px) !important;
        max-width: calc(40%-10px) !important; */
        /* width: 38%;
        max-width: 38%; */
      }
      
    }

    /* .wideProgram {
      min-width: 380px !important;
      max-width: 795px !important;
    } */

    /* .wideToolbox {
      width: 280px !important;
    } */

    
</style>
