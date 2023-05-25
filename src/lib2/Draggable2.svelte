<script>
    // import VerticalList from './VerticalList.svelte';
    import Board from '../lib/Board.svelte';

	import {steps} from '../lib/stores.js';

	import {levelStore} from '../lib/stores.js';
	let level=0;


	import { indentsStore} from '../lib/stores.js';

	import { repCountsStore} from '../lib/stores.js';

	let toolboxItems, columnsData;
	
	
	toolboxItems = [
		{id: 1, name: "move_left()", indent:0},
		{id: 2, name: "move_right()", indent:0},
		{id: 3, name: "move_up()", indent:0},
		{id: 4, name: "move_down()", indent:0},
		{id: 5, name: "water()", indent:0}
	]
	
	columnsData = [
		{
			id: "c1",
			name: "toolbox",
			items: [
				{id: 1, name: "move_left()", indent:0},
				{id: 2, name: "move_right()", indent:0},
				{id: 3, name: "move_up()", indent:0},
				{id: 4, name: "move_down()", indent:0},
				{id: 5, name: "water()", indent:0}
			]
		},
		{
			id: "c2",
			name: "program",
			items: [
			]
		}
	];

	if (level>0){
		toolboxItems.push({id: 6, name: "repeat ____ times:", indent:0})
	}
	if (level>0){
		columnsData[0].items.push({id: 6, name: "repeat ____ times:", indent:0})
	}

	levelStore.subscribe(value => {
		level = value;
		handleLevelUpdate()
	});

	function resetAll(){
		handleLevelUpdate();
	}

	function handleLevelUpdate(){
		console.log(" LEVEL UPDATE")
		console.log(level)
		// reset options
		toolboxItems = [
			{id: 1, name: "move_left()", indent:0},
			{id: 2, name: "move_right()", indent:0},
			{id: 3, name: "move_up()", indent:0},
			{id: 4, name: "move_down()", indent:0},
			{id: 5, name: "water()", indent:0}
		]
		
		columnsData = [
			{
				id: "c1",
				name: "toolbox",
				items: [
					{id: 1, name: "move_left()", indent:0},
					{id: 2, name: "move_right()", indent:0},
					{id: 3, name: "move_up()", indent:0},
					{id: 4, name: "move_down()", indent:0},
					{id: 5, name: "water()", indent:0}
				]
			},
			{
				id: "c2",
				name: "program",
				items: [
				]
			}
		];
		// add repeat if level > 0
		if (level>0){
			toolboxItems.push({id: 6, name: "repeat ____ times:", indent:0})
		}
		if (level>0){
			columnsData[0].items.push({id: 6, name: "repeat ____ times:", indent:0})
		}
		

	}


	function handleBoardUpdated(newColumnsData) {
		// regenerate toolbox values
		console.log("HANDLE UPDATE")
		console.log(newColumnsData)

		for (let i=0; i<toolboxItems.length; i++) {
			// check[colTool[i].id] = 1;
			console.log(toolboxItems[i])
			toolboxItems[i].id += 10
		};
		// for (let i=0;i++;i<check.length) {
		// 	if (check[i]===0) {
		// 		toolboxItems[i].id += 10
		// 	}
		// }
		newColumnsData[0].items = toolboxItems;
		// if you wanted to update a database or a server, this is where you would do it
		columnsData = newColumnsData;
		let programData = formatSteps(columnsData[1].items);
		let indentsF = formatIndents(columnsData[1].items);
		indentsStore.update(contents => indentsF)
		steps.update(contents => programData)
	}

	function formatSteps(items) {
		let steps = [];
		items.forEach(element => {
			let key;
			
			switch (element.name) {
				case 'move_up()':
					key = 'u';
					break;
				case 'move_down()':
					key = 'd';
					break;
				case "move_left()":
					key = 'l';
					break;
				case "move_right()":
					key = 'r';
					break;
				case "water()":
					key = 'w';
					break;
				case "repeat ____ times:":
					key = 'repeat';
					break;
			}
			steps.push(key);
		});
		return steps;
	}

	function formatIndents(items) {
		let indentsF = [];
		items.forEach(element => {
			indentsF.push(element.indent);
		});
		return indentsF;
	}
	

</script>

<div class="together">
	<Board columns={columnsData} onFinalUpdate={handleBoardUpdated}/>
	<button class="resetButton" on:click={resetAll}> Clear All </button>

</div>


<style>
.resetButton {
    position: absolute;
    right: 15px;
    bottom: 15px;
    background-color: white;
    padding: 5px;
    /* border: 0.5px black solid; */
    font-size: 15px;
  }

.together {
	display: flex;
	padding: 0;
	margin: 0;
	position: relative;
}
	
:global(*) {
		box-sizing: border-box;
		margin: 0;
	}

</style>