<script>
    // import VerticalList from './VerticalList.svelte';
    import Board from '../lib/Board.svelte';

	import {stepI, steps} from '../lib/stores.js';

	import {levelStore} from '../lib/stores.js';
	import {numStepsStore} from '../lib/stores.js';
	let level=0;

	import { indentsStore} from '../lib/stores.js';
	import { repCountsStore} from '../lib/stores.js';

	let repeatCounts = [];
    repCountsStore.subscribe(value => {
      repeatCounts = value;
    });

	let indentsThis = [];
    indentsStore.subscribe(value => {
		indentsThis = value;
    });

	let numCommands = 0;
    // numCommandsStore.subscribe(value => {
	// 	numCommands = value;
    // });

	let toolboxItems, columnsData;
	let numSteps = 0;
	
	handleLevelUpdate();

	levelStore.subscribe(value => {
		level = value;
		handleLevelUpdate()
	});

	function resetAll(){
		handleLevelUpdate();
	}

	function handleLevelUpdate(){
		
		// reset options
		toolboxItems = []
		
		columnsData = [
			{
				id: "c1",
				name: "toolbox",
				items: []
			},
			{
				id: "c2",
				name: "program",
				items: [
				]
			}
		];
		if (level<4){
			toolboxItems.push({id: 1, name: "move_left()", indent:0, repeat:1})
			columnsData[0].items.push({id: 1, name: "move_left()", indent:0, repeat:1})
			toolboxItems.push({id: 2, name: "move_right()", indent:0, repeat:1})
			columnsData[0].items.push({id: 2, name: "move_right()", indent:0, repeat:1})
			toolboxItems.push({id: 3, name: "move_up()", indent:0, repeat:1})
			columnsData[0].items.push({id: 3, name: "move_up()", indent:0, repeat:1})
			toolboxItems.push({id: 4, name: "move_down()", indent:0, repeat:1})
			columnsData[0].items.push({id: 4, name: "move_down()", indent:0, repeat:1})
		}

		// add level-dependent commands
		if (level<3){
			toolboxItems.push({id: 5, name: "water()", indent:0, repeat:1})
			columnsData[0].items.push({id: 5, name: "water()", indent:0, repeat:1})
		}

		if (level>=1 && level<4){
			toolboxItems.push({id: 6, name: "repeat ____ times:", indent:0, repeat:1})
			columnsData[0].items.push({id: 6, name: "repeat ____ times:", indent:0, repeat:1})
		}

		if (level==3){
			toolboxItems.push({id: 9, name: "weed = check_for_weeds()", indent:0, repeat:1})
			columnsData[0].items.push({id: 9, name: "weed = check_for_weeds()", indent:0, repeat:1})
			toolboxItems.push({id: 7, name: "if weed:", indent:0, repeat:1})
			columnsData[0].items.push({id: 7, name: "if weed:", indent:0, repeat:1})
			toolboxItems.push({id: 8, name: "remove_weeds()", indent:0, repeat:1})
			columnsData[0].items.push({id: 8, name: "remove_weeds()", indent:0, repeat:1})
		}

		if (level==4){
			toolboxItems.push({id: 1, name: "index_list = [0,1,...,24]", indent:0, repeat:1})
			columnsData[0].items.push({id: 1, name: "index_list = [0,1,...,24]", indent:0, repeat:1})
			toolboxItems.push({id: 2, name: "go_to(position)", indent:0, repeat:1})
			columnsData[0].items.push({id: 2, name: "go_to(position)", indent:0, repeat:1})
			toolboxItems.push({id: 3, name: "for position in index_list:", indent:0, repeat:1})
			columnsData[0].items.push({id: 3, name: "for position in index_list:", indent:0, repeat:1})
			toolboxItems.push({id: 7, name: "bad = check_infection()", indent:0, repeat:1})
			columnsData[0].items.push({id: 7, name: "bad = check_infection()", indent:0, repeat:1})
			toolboxItems.push({id: 4, name: "add position to infected_list", indent:0, repeat:1})
			columnsData[0].items.push({id: 4, name: "add position to infected_list", indent:0, repeat:1})
			toolboxItems.push({id: 5, name: "infected_list = []", indent:0, repeat:1})
			columnsData[0].items.push({id: 5, name: "infected_list = []", indent:0, repeat:1})
			toolboxItems.push({id: 6, name: "if bad:", indent:0, repeat:1})
			columnsData[0].items.push({id: 6, name: "if bad:", indent:0, repeat:1})

		}

		handleBoardUpdated(columnsData);
		
	}


	function handleBoardUpdated(newColumnsData) {
		// regenerate toolbox values
		console.log("HANDLE UPDATE")

		for (let i=0; i<toolboxItems.length; i++) {
			// check[colTool[i].id] = 1;
			// console.log(toolboxItems[i])
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
		let repCounts = formatRepeats(columnsData[1].items);
		indentsStore.update(contents => indentsF);
		repCountsStore.update(contents => repCounts);
		steps.update(contents => programData);
		let numC = getNumSteps(programData);
		numStepsStore.update(contents => numC);
		numCommands = repCounts.length;
	}


	function getNumSteps(programData) {

		// count all steps, including all as single steps, just iterating through repeats
		let stepIndexHere = 0;
		let countSteps = 0;
		let repeatQueueCounts = [];
		let repeatQueueStartIndices = [];
		let currRepIndex = -1;

		console.log("TRY COUNT STEPS")

		while (currRepIndex >= 0 || stepIndexHere < programData.length+1){

			// check if current repeat ends or program ends
			if (currRepIndex >=0 && ((stepIndexHere) >= programData.length || indentsThis[stepIndexHere]<=indentsThis[repeatQueueStartIndices[currRepIndex]])) {
				// if more repeats to do, go back to beginning of repeat (after repeat command)
				console.log("found end of repeat block. index:" + stepIndexHere)
				console.log("back to start." + repeatQueueCounts + " more times." + currRepIndex)

				if (repeatQueueCounts[currRepIndex] > 0){
					repeatQueueCounts[currRepIndex] -= 1;
					countSteps += 1;
					stepIndexHere = repeatQueueStartIndices[currRepIndex]+1;

				} else { // if done repeating, remove this repeat from queue
					currRepIndex -= 1;
					continue;
					// countSteps += 1;
					// repeatQueueStartIndices.pop();
					// repeatQueueCounts.pop();
					// check if this is ALSO the end of another repeat block
					// countSteps -= 1;
					// stepIndexHere -= 1;
				}
				
			} 

			// if found repeat, add
			if (stepIndexHere < programData.length && programData[stepIndexHere]=='repeat'){ //  && !repeatQueueStartIndices.includes(stepIndexHere)

				// if repeat is just one command (repeat command), add manually
				if ((stepIndexHere+1) >= programData.length || indentsThis[stepIndexHere+1]<=indentsThis[stepIndexHere]) {
					countSteps += repeatCounts[stepIndexHere]-1;
					console.log("MANUAL. found repeat with count " + repeatCounts[stepIndexHere] + ". rep index: " + currRepIndex)
				} else {
					repeatQueueCounts.push(repeatCounts[stepIndexHere]-1);
					repeatQueueStartIndices.push(stepIndexHere);
					currRepIndex += repeatQueueCounts.length;
					console.log("found repeat with count " + repeatCounts[stepIndexHere] + ". rep index: " + currRepIndex)
				}
				
			}

			countSteps += 1;
			stepIndexHere += 1;
			
		}

		countSteps -= 1;

		return countSteps;
	}


	

	function formatSteps(items) {
		let steps = [];
		items.forEach(element => {
			let key;
			console.log(element)

			
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
				case "weed = check_for_weeds()":
					key = 'check weed';
					break;
				case "if weed:":
					key = 'if weed';
					break;
				case "remove_weeds()":
					key = 'deweed';
					break;
				case "repeat ____ times:":
					key = 'repeat';
					break;
				case "index_list = [0,1,...,24]":
					key = 'index_list';
					break;
				case "go_to(position)":
					key = 'go_to';
					break;
				case "for position in index_list:":
					key = 'for_position';
					break;
				case "bad = check_infection()":
					key = 'check_infection';
					break;
				case "add position to infected_list":
					key = 'add_position';
					break;
				case "infected_list = []":
					key = 'infected_list';
					break;
				case "if bad:":
					key = 'if_bad';
					break;
			}
			steps.push(key);
		});
		return steps;
	}

	function formatRepeats(items) {
		let repCounts = [];
		items.forEach(element => {
			repCounts.push(element.repeat);
		});
		return repCounts;
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
	<div class:hide={level==0 || level==4} class="numSteps"> #Steps: {numSteps} </div>
	<div class="numCommands"> #Commands: {numCommands} </div>
</div>


<style>
	.hide {
		display: none;
	}

	.numSteps {
		position: absolute;
		right: 95px;
		bottom: 11px;
		padding: 5px;
		
	}

	.numCommands {
		position: absolute;
		right: 179px;
		bottom: 11px;
		padding: 5px;
		
	}
	

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