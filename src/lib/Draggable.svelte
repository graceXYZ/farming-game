<script>
    // import VerticalList from './VerticalList.svelte';
    import Board from '../lib/Board.svelte';
	import Icon from '../lib/Icon.svelte';

	import {stepI, steps} from '../lib/stores.js';

	import {levelStore} from '../lib/stores.js';
	import {numStepsStore} from '../lib/stores.js';
	import {numCommandsStore} from '../lib/stores.js';
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
    numCommandsStore.subscribe(value => {
		numCommands = value;
    });

	let toolboxItems, columnsData;
	let numSteps = 0;
	numStepsStore.subscribe(value => {
		numSteps = value;
    });
	
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
				name: "Toolbox",
				items: []
			},
			{
				id: "c2",
				name: "Program",
				items: [
				]
			}
		];
		if (level<3){
			toolboxItems.push({id: 5, name: "water()", indent:0, repeat:1})
			columnsData[0].items.push({id: 5, name: "water()", indent:0, repeat:1})
		}

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

		if (level>=1 && level<4){
			toolboxItems.push({id: 6, name: "repeat ____ times :", indent:0, repeat:1})
			columnsData[0].items.push({id: 6, name: "repeat ____ times :", indent:0, repeat:1})
		}

		if (level==3){
			toolboxItems.push({id: 9, name: "is_weed = check_weeds()", indent:0, repeat:1})
			columnsData[0].items.push({id: 9, name: "is_weed = check_weeds()", indent:0, repeat:1})
			toolboxItems.push({id: 7, name: "if is_weed :", indent:0, repeat:1})
			columnsData[0].items.push({id: 7, name: "if is_weed :", indent:0, repeat:1})
			toolboxItems.push({id: 8, name: "remove_weeds()", indent:0, repeat:1})
			columnsData[0].items.push({id: 8, name: "remove_weeds()", indent:0, repeat:1})
		}

		if (level==4){
			toolboxItems.push({id: 1, name: "index_list = [0,1,...,8]", indent:0, repeat:1})
			columnsData[0].items.push({id: 1, name: "index_list = [0,1,...,8]", indent:0, repeat:1})
			toolboxItems.push({id: 2, name: "go_to(position)", indent:0, repeat:1})
			columnsData[0].items.push({id: 2, name: "go_to(position)", indent:0, repeat:1})
			toolboxItems.push({id: 3, name: "for position in bad_list :", indent:0, repeat:1})
			columnsData[0].items.push({id: 3, name: "for position in bad_list :", indent:0, repeat:1})
			toolboxItems.push({id: 7, name: "is_bad = check_status()", indent:0, repeat:1})
			columnsData[0].items.push({id: 7, name: "is_bad = check_status()", indent:0, repeat:1})
			toolboxItems.push({id: 4, name: "add position to bad_list", indent:0, repeat:1})
			columnsData[0].items.push({id: 4, name: "add position to bad_list", indent:0, repeat:1})
			toolboxItems.push({id: 5, name: "bad_list = []", indent:0, repeat:1})
			columnsData[0].items.push({id: 5, name: "bad_list = []", indent:0, repeat:1})
			toolboxItems.push({id: 6, name: "if is_bad :", indent:0, repeat:1})
			columnsData[0].items.push({id: 6, name: "if is_bad :", indent:0, repeat:1})

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
		numCommandsStore.update(contents => numCommands);
	}


	function getNumSteps(programData) {

		// count all steps, including all as single steps, just iterating through repeats
		let stepIndexHere = 0;
		let countSteps = 0;
		let repeatQueueCounts = [];
		let repeatQueueStartIndices = [];
		let currRepIndex = -1;

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

		console.log("TRY COUNT STEPS" + countSteps)

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
				case "is_weed = check_weeds()":
					key = 'check weed';
					break;
				case "if is_weed :":
					key = 'if weed';
					break;
				case "remove_weeds()":
					key = 'deweed';
					break;
				case "repeat ____ times :":
					key = 'repeat';
					break;
				case "index_list = [0,1,...,8]":
					key = 'index_list';
					break;
				case "go_to(position)":
					key = 'go_to';
					break;
				case "for position in bad_list :":
					key = 'for_position';
					break;
				case "is_bad = check_status()":
					key = 'check_infection';
					break;
				case "add position to bad_list":
					key = 'add_position';
					break;
				case "bad_list = []":
					key = 'infected_list';
					break;
				case "if is_bad :":
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
	<button class="resetButton" on:click={resetAll}> 
		<div class="playButton">
			<Icon name=5 width="12px" height="13px"/>
		</div>
		<div class="clearAll">
			Clear All 
		</div>
	</button>
	<!-- <div class:hide={level==0 || level==4} class="numSteps"> #Steps: {numSteps} </div> -->
	<!-- <div class="numCommands"> #Commands: {numCommands} </div> -->
</div>


<style>
	.playButton {
		position: relative;
		width: 6px;
		height: 14px;
		font-family: 'Font Awesome 6 Free';
		font-style: normal;
		font-weight: 900;
		font-size: 14px;
		line-height: 14px;
		display: flex;
		align-items: center;
		text-align: center;

	}

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
		right: 10px;
		bottom: 10px;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 6px;
		gap: 15px;

		width: 88px;
		height: 26px;

		/* Grayscale/White */
		background: #FFFFFF;
		border-radius: 2.5px;

		/* Inside auto layout */

		flex: none;
		order: 2;
		flex-grow: 0
	}

	.clearAll {
		font-family: 'Roboto', sans-serif;
		font-weight: 700;
		font-size: 14px;
		line-height: 16px;

		/* Grayscale/Black */
		color: #000000;


		/* Inside auto layout */

		flex: none;
		order: 1;
		flex-grow: 0;
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