<script>

    import { steps} from '../lib/stores.js';
    import { indentsStore} from '../lib/stores.js';
    import { repCountsStore} from '../lib/stores.js';
    import { stepI } from '../lib/stores.js';
    import { feedback } from '../lib/stores.js';
    import { feedbackCodeS } from '../lib/stores.js';
    import { charSelectStore } from '../lib/stores.js';
    import Icon from "./Icon.svelte";

    // let weedCheckPosition = 0;
    let currentWeedVal = -1; // -1 if not set. 0 if sapling. 1 if weed. 2 if dead.
    let nextStepIndexWeed = 0;
    let executeSkipBlockWeed = false;
    let resetPending = false;

    let charSelect;
    charSelectStore.subscribe(value => {
      charSelect = value;
    });

    let startorPause = ["Start","Pause"]

    let x = 0
    let BOARD_SIZE_W = 2;
    let BOARD_SIZE_H = 2;
    let choiceChar = 0;
    let inRepeat = false;
    let startRepeatIndex = [];
    // let breakRepeat = [];
    let currRepeatIndex = -1;
    let repeatCountsLeft = [];
    let iterateTime = 750;
    
    import {levelStore} from '../lib/stores.js';
    import { navigating } from '$app/stores';
    let level = 0;
    levelStore.subscribe(value => {
      level = value;
    });

    let widthBoard = 250;
    let rowHeight = widthBoard / BOARD_SIZE_H;

    // every cell in boardwill have a sapling, or be de-weeded successfully, or be dead. 
    const WEED_CELL = 0;
    const DEWEED_CELL = 1;
    const DEAD_CELL = 2;

    // every cell in boardWaterwill have dry or wet soil
    const SAPLING_CELL = 0;
    const DRY_CELL = 0;
    const WET_CELL = 1;
    
    let board;
    let boardWater;
    let boardWeed;
    let blockedCells;
    let charPosition;
    let gameInterval;


    $: {
      console.log("LEVEL CHANGED")
      console.log(level);
      if (level== 0){
        BOARD_SIZE_W = 2;
        BOARD_SIZE_H = 2;
        widthBoard = 250;
        iterateTime = 750;
      } else if (level==1){
        BOARD_SIZE_W = 4;
        BOARD_SIZE_H = 2;
        widthBoard = 150;
        iterateTime = 600;
      } else if (level==2){
        BOARD_SIZE_W = 6;
        BOARD_SIZE_H = 4;
        widthBoard = 200;
        iterateTime = 500;
      } else if (level==3){
        BOARD_SIZE_W = 1;
        BOARD_SIZE_H = 5;
        widthBoard = 350;
        iterateTime = 600;
      }
      rowHeight = widthBoard / BOARD_SIZE_H;
      newGame();
    }

    let started = 0;

    let feedbackItems = {'drag': 'Drag the toolbox commands into the program and press play!',
                          'incorrect': 'Make sure to water all the plants!',
                          'correct': 'Great job! You completed this level!',
                          'collision': 'You can\'t walk outside the field!',
                          'bad indent': 'Your indents are not correct!',
                          'start indent': 'Your first command should not be indented!',
                          'bad variable use': "You used a variable without setting its value!",
                          'correctWeed': "You successfully removed all weeds without killing the beets!",
                          'incorrectWeed': "There are weeds and/or dead beets :("
                        }; 


    const XYZ_COLORS = ['#FF4040','#40A040','#5050F1']
    const XYZ_SHADES = ['#000000','#1D1D1D','#444444','#C4C4C4','#E5E5E5','#FFFFFF']

    let stepIndex = -1;
    stepI.subscribe(value => {
      stepIndex = value;
    });
    let nextStepIndex = 0;

    let stepsFormat = [];
    steps.subscribe(value => {
      stepsFormat = value;
    });

    let indents = [];
    indentsStore.subscribe(value => {
      indents = value;
    });

    let repeatCounts = [];
    repCountsStore.subscribe(value => {
      repeatCounts = value;
    });

    function newGame() {
      board = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      boardWater = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      boardWeed = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      blockedCells = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      if (level == 2){
        blockedCells[1][1] = 1;
      }
      
      // fill weed with random vals
      for (let outer = 0; outer < BOARD_SIZE_H; outer ++){
        for (let inner = 0; inner < BOARD_SIZE_W; inner ++){ 
          boardWeed[outer][inner] = Math.floor(Math.random() * 2);
        }
      }
      
      charPosition = [0, 0];
      updateFeedback('drag')
      inRepeat = false;
      startRepeatIndex = [];
      // breakRepeat = [];
      currRepeatIndex = -1;
      repeatCountsLeft = [];
    }


    function updatePosition(position) {
      charPosition = position;
      nextStepIndex = stepIndex + 1;
    }

    function updateFeedback(key){
      let newItem = feedbackItems[key]
      feedback.update(n => newItem)
      feedbackCodeS.update(n=> key)
    }

    function outOfBounds(){
      console.log("cant move that way!")
      updateFeedback("collision")
      resetPending = true;
      stop();
    }


    function checkForCollision(position) {
        const [x, y] = position;

        if (x < 0 || x === BOARD_SIZE_H || y < 0 || y === BOARD_SIZE_W) return outOfBounds();
        // if (board[x][y] === SNEK_CELL) return gameOver();
        // if (board[x][y] === FOOD_CELL) return eatFood(position);

        return updatePosition(position);
    }

    function waterCell(position){
      const [x, y] = position;
      boardWater[x][y] = WET_CELL;
      nextStepIndex = stepIndex + 1;
    }

    function move() {


        stepI.update(n => nextStepIndex)
        console.log("STEP INDEX: " + stepIndex)

        if (stepIndex > stepsFormat.length) {
          checkSuccess();
          resetPending = true;
          stop();
          return
        }

        // if we are in a repeat section
        // check if we're at the end of the repeat section. if so, move back up.
        if (inRepeat){
          checkRepeat()
        }

        // check correct indent (if increase indent with no repeat, throw error)
        checkIndent()

        // if (executeSkipBlockWeed) {
        //   executeSkipBlockWeed = false;
        //   stepI.update(n => nextStepIndexWeed)
        // }

        if (stepIndex >= stepsFormat.length) {
          checkSuccess();
          resetPending = true;
          stop();
          return
        }
        
        console.log("step")
        console.log(stepIndex)

        let direction = stepsFormat[stepIndex]
        const [currX, currY] = charPosition;

        switch (direction) {
          case 'r':
            return checkForCollision([currX, currY + 1]);
          case 'l':
            return checkForCollision([currX, currY - 1]);
          case 'u':
            return checkForCollision([currX - 1, currY]);
          case 'd':
            return checkForCollision([currX + 1, currY]);
          case 'w':
            return waterCell([currX, currY]);
          case 'check weed':
            return dealWithWeed([currX, currY, direction]);
          case 'if weed':
            return dealWithWeed([currX, currY, direction]);
          case 'deweed':
            return dealWithWeed([currX, currY, direction]);
          case 'repeat':
            // if we found a NEW repeat. add details. repeat behavior is handled when inRepeat above
            // console.log(startRepeatIndex)
            if (startRepeatIndex.length==0 || !startRepeatIndex.includes(stepIndex)) {
              inRepeat = true;
              console.log("FOUND NEW REPEAT")
              currRepeatIndex += 1; 
              // add # repeats left in repeatCounts. this will be iterated down until 0
              repeatCountsLeft.push(parseInt(repeatCounts[stepIndex]))
              startRepeatIndex.push(stepIndex);
              // breakRepeat.push(false);
            }
            nextStepIndex = stepIndex + 1;
        }
    }


    function dealWithWeed([currX, currY, direction]){
      let vals = ['check weed','if weed','deweed'];

      // check_weed()
      if (direction == vals[0]) {
        currentWeedVal = boardWeed[currX][currY]; 
        nextStepIndex = stepIndex + 1;
        console.log("update weed val:" + currentWeedVal)
        
      } else if (direction == vals[1]) { // if weed:
        // if we haven't set 'weed' variable
        if (currentWeedVal==-1){
          console.log("currentWeedVal not set")
          updateFeedback("bad variable use")
          resetPending = true;
          stop();
        } else if (currentWeedVal==1) {
          // if weed is true (has weed), continue and enter block
          console.log("if weed true, continue")
          nextStepIndex = stepIndex + 1;
        } else {
          console.log("if weed false, skip block")
          // if weed is false (sapling or dead), skip block
          // find next step index without this indent
          nextStepIndexWeed = stepIndex+1;
          while (nextStepIndexWeed < stepsFormat.length && indents[nextStepIndexWeed]==indents[stepIndex]+50){
            nextStepIndexWeed += 1; 
            executeSkipBlockWeed = true;
          }
          console.log("skipping to index: " + nextStepIndexWeed)
          nextStepIndex = nextStepIndexWeed;
        }

      } else {
        // remove_weed()
        if (boardWeed[currX][currY]==1) {
          boardWeed[currX][currY] = 0;
        } else { // removed sapling!!
          // updateFeedback("dead")
          boardWeed[currX][currY] = 2;
        }
        nextStepIndex = stepIndex + 1;
      }
    }

    
    function checkIndent() {
      // check correct indent (if increase indent with no repeat, throw error)
      // remember indents are multiples of 50 

      // start with indent
      if (indents[0]!=0){
        updateFeedback('start indent');
        resetPending = true;
        stop()
        return
      }
      // indent increases by more than 1
      if (indents[stepIndex]>indents[stepIndex-1]+50){
        updateFeedback('bad indent');
        console.log(indents[stepIndex])
        console.log(indents[stepIndex-1]+50)
        console.log("INDENT 1 CASE")
        resetPending = true;
        stop()
        return
      }
      // indent increases without REPEAT or CONDITIONAL block starting
      if (indents[stepIndex]==indents[stepIndex-1]+50){
        console.log(stepsFormat[stepIndex])
        if (stepsFormat[stepIndex-1]=='repeat' || stepsFormat[stepIndex-1]=='if weed') {
          return
        } else {
          updateFeedback('bad indent');
          console.log("INDENT 2 CASE")
          resetPending = true;
          stop()
          return 
        }
      }
      
    }

    function checkRepeat(){
      // this is called every step that were in a repeat section
      // if we are at the end of the repeat section and we have to repeat again, restart the section

      // if repeat block reaches the end of the program
      //   OR if next line is in line or lower than repeat block

      //   OR if we are skipping an internal conditional block that ends a repeat
      let internalConditionalBlockEnd = false;
      if (executeSkipBlockWeed && nextStepIndexWeed == stepsFormat.length){
        internalConditionalBlockEnd = true;
        executeSkipBlockWeed = false;
        console.log("SAVE REPEAT")
      }
      
      if (stepIndex == stepsFormat.length || internalConditionalBlockEnd || indents[stepIndex]<=indents[startRepeatIndex[currRepeatIndex]]) {
        repeatCountsLeft[currRepeatIndex] -= 1;
        console.log("WHOOOO")
        console.log(repeatCountsLeft)
        console.log(currRepeatIndex)
        // if we've repeated X number of times, stop! REMOVE repeat so if outer repeat, we will do it again.
        if (repeatCountsLeft[currRepeatIndex] <= 0){
          // breakRepeat[currRepeatIndex] = true;
          console.log("break repeat")
          currRepeatIndex -= 1;
          startRepeatIndex.pop()
          repeatCountsLeft.pop()
          if (currRepeatIndex==-1){
            inRepeat = false;
            // if weed is true and block ends program,
            // if ( boardWeed[weedCheckPosition[0]][weedCheckPosition[1]] &&  nextStepIndexWeed >= stepsFormat.length) {
            //   executeSkipBlockWeed = true;
            // }
            // console.log(nextStepIndexWeed)
            // console.log(weedCheckPosition)
          } else {
            console.log("GOINT TO PREVIOUS REPEAT")
            checkRepeat()
          }
          return;
        }
        // if more repeats to do, restart section
        stepI.update(n => startRepeatIndex[currRepeatIndex])
      }
    }


    function checkSuccess() {
      if (level < 3){
        let watered;
        watered = allWatered()
        if (watered){
          updateFeedback('correct');
        } else {
          updateFeedback('incorrect');
        }
      } else {
        let weeded;
        weeded = allWeeded();
        if (weeded){
          console.log("correct weed")
          updateFeedback('correctWeed');
        } else {
          console.log("incorrect weed")
          updateFeedback('incorrectWeed');
        }
      }
      
    }

    function allWeeded() {
      for (let outer = 0; outer < BOARD_SIZE_H; outer ++){
        for (let inner = 0; inner < BOARD_SIZE_W; inner ++){ 
          if (level==3 && outer ==0 && inner==0){
            continue;
          }
          if (boardWeed[outer][inner] != 0) { // if any are dead (2) or have weeds (1)
            console.log("NOT ALL WEEDED!")
            return false;
          }
        }
      }
      console.log("ALL WEEDED!")
      return true;
    }

    function allWatered(){
      for (let outer = 0; outer < BOARD_SIZE_H; outer ++){
        for (let inner = 0; inner < BOARD_SIZE_W; inner ++){ 
          if (level==3 && outer ==0 && inner==0){
            continue;
          }
          if (boardWater[outer][inner] == DRY_CELL) {
            console.log("NOT ALL WATERED!")
            return false;
          }
        }
      }
      console.log("ALL WATERED!")
      return true;
    }


    function start() {
        if (stepIndex >= stepsFormat.length || resetPending) {
          reset();
        }
        resetPending = false;
        // start if we're not started
        if (started==0) {
          gameInterval = setInterval(move, iterateTime);
          started = 1;
        } else { // pause if we're started
          started = 0;
          clearInterval(gameInterval);
        }
    }


    function stop() {
        clearInterval(gameInterval);
        stepI.update(n => -1)
        started = 0;
        return
    }


    // function pause() {
    //   if (started){
    //     gameInterval = setInterval(move, iterateTime);
    //   } else {
    //     clearInterval(gameInterval);
    //   }
    // }


    function reset() {
        clearInterval(gameInterval);
        currentWeedVal = -1;
        stepI.update(n => -1);
        started = 0;
        nextStepIndex = 0;
        newGame();
    }


    newGame();
    
  </script>
  
  <div class="wrapper">

  
  <h2>field</h2>


  <div class="field" style="grid-template-columns: repeat({BOARD_SIZE_W}, 1fr); grid-auto-rows: {rowHeight}; width:{BOARD_SIZE_W*rowHeight}px; height:{BOARD_SIZE_H*rowHeight}px">
      {#each board as row, outerIndex}
        {#each row as cell, index}
          <div class="cell" class:character={charPosition[0]==outerIndex && charPosition[1]==index}
          class:sapling={board[outerIndex][index] == SAPLING_CELL} class:watered={boardWater[outerIndex][index] == WET_CELL}
          class:weed={level == 3 && boardWeed[outerIndex][index] == 1} class:dead={level == 3 && boardWeed[outerIndex][index] == DEAD_CELL}
          class:startBox={level==3 && outerIndex==0 && index == 0}
          class:blocked = {blockedCells[outerIndex][index]==1}>
            <!-- {#if board[outerIndex][index] === 1}
              <Character {choiceChar}/>
            {:else if board[outerIndex][index] === 0}
              <Sapling {level}/>
            {/if} -->
            {blockedCells[outerIndex][index]}
            
            <div class="characterSVG" class:hideCell={charPosition[0]!=outerIndex || charPosition[1]!=index}>
              <Icon name={charSelect} width="{rowHeight}px" height="{rowHeight}px" class="large"/>
            </div>

          </div>
        {/each}
      {/each}
  </div>

  <div class="controls">
    <button on:click={start}> {startorPause[started]}</button>
    <button on:click={reset}> Restart</button>
    <!-- <button on:click={pause}>  </button> -->
  </div>
  

</div>

  
  <style>
    .hideCell {
      display: none;
    }

    .characterSVG {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
    }

    .sapling {
      background-color: rgba(64, 160, 64, 1);
    }

    .dead {
      background-color: rgb(127, 88, 63);
    }

    .startBox {
      background-color: rgb(203, 203, 203) !important;
    }

    .weed {
      background-color: rgb(160, 214, 60);
    }

    .blocked {
      background-color: black;
    }

    .watered {
      background-color: rgb(37, 86, 37);
    }

    :root {
      --ratioA: 1;
      --ratioB: 1;
    }

    .cell {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0.1px black solid;
    }
    .controls {
        margin: auto;
        display: flex;
        justify-content: center;
        height: 40px;
    }

    .field {
        margin: auto auto;
        background-color: rgb(245, 245, 245);        
        /* position: relative; */
        display: grid;
    }
    .wrapper {
        position: relative;
        padding: 1em;
        margin: 0.5em;
        min-width: 280px;
        border: solid black 1px;
        display:grid;
        grid-template-rows: 50px 1fr 60px;
        
    }

    @font-face {
      font-family: 'Roboto';
      src: url("https://fonts.googleapis.com/css2?family=Roboto&display=swap") format("woff");
    }
    
    h2 {
      text-align: center;
      font-family: 'Roboto', sans-serif;
      font-weight: 100;
      color: #000000;
      height: 1.5em;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.7em;
      user-select: none;
      margin: 0px auto;
    }

    button {
      font-family: 'Roboto', sans-serif;
      font-weight: 100;
      color: #000000;
      font-size: 1em;
      margin: 0 0.2em;
      border: 0.5px black solid;
    }
  </style>
  
  
  
  