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
    if (name == "toolbox") {
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
    <div  class:wideToolbox="{level>=3}" class:program="{name==='program'}" class:wideProgram={level>=3 && name==='program'} class="column" animate:flip="{{duration: flipDurationMs}}" >    
      <Column name={name} items={items} onDrop={(newItems) => handleItemFinalize(idx, name, newItems)}/>
    </div>
  {/each}

</section>


<style>

  .board {
    display:flex;
    /* width: 100%; */
    position: relative;
  }

  .column {
      height: 500px;
      min-width: 215px; 
      padding: 0.5em;
      margin: 0.5em;
      float: left;
      /* border: 1px solid #333333; */
      background-color: rgb(245, 245, 245);
  }

  .program {
      width: 100%;
      min-width: 300px;
      /* max-width: 500px !important; */
    }

    .wideProgram {
      min-width: 380px !important;
      max-width: 795px !important;
    }

    .wideToolbox {
      width: 280px !important;
    }

    @font-face {
      font-family: 'Roboto';
      src: url("https://fonts.googleapis.com/css2?family=Roboto&display=swap") format("woff");
    }
    
</style>
