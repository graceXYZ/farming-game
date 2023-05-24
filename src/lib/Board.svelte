<script>
	import { flip } from 'svelte/animate';
	import Column from "./Column.svelte";

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

<style>
  .board {
    display:flex;
    /* width: 100%; */
    /* position: relative; */
  }
    .column {
        height: 400px;
        width: 200px;
        padding: 0.5em;
        margin: 0.5em;
        float: left;
        /* border: 1px solid #333333; */
        background-color: rgb(245, 245, 245);
    }
    .program {
      width: 100%;
      min-width: 300px;
      max-width: 350px !important;
    }

    @font-face {
      font-family: 'Roboto';
      src: url("https://fonts.googleapis.com/css2?family=Roboto&display=swap") format("woff");
    }
    
</style>

<section class="board">
    {#each columns as {id, name,items,indents}, idx (id)}
  		<div class:program="{name==='program'}" class="column" animate:flip="{{duration: flipDurationMs}}" >    
				<Column name={name} items={items} onDrop={(newItems) => handleItemFinalize(idx, name, newItems)}/>
			</div>
    {/each}
</section>