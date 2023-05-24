<script>

    import { steps} from '../lib/stores.js';
    import { indentsStore} from '../lib/stores.js';
    import { repCountsStore} from '../lib/stores.js';
    import { stepI } from '../lib/stores.js';
    import { feedback } from '../lib/stores.js';
    import { charSelectStore } from '../lib/stores.js';
    import Icon from "./Icon.svelte";

    let charSelect;
    charSelectStore.subscribe(value => {
      charSelect = value;
    });

    let x = 0
    let BOARD_SIZE = 2;
    let choiceChar = 0;
    let inRepeat = false;
    let startRepeatIndex = 0;
    let repeatCount = 0;
    let breakRepeat = false;

    import {levelStore} from '../lib/stores.js';
    let level = 0;
    levelStore.subscribe(value => {
      level = value;
    });

    let widthBoard = 250;
    let rowHeight = widthBoard / BOARD_SIZE;

    // every cell in boardwill be empty or have a sapling
    const EMPTY_CELL = 0;
    const SAPLING_CELL = 0;

    // every cell in boardWaterwill have dry or wet soil
    const DRY_CELL = 0;
    const WET_CELL = 1;
    
    let board;
    let boardWater;
    let charPosition;
    let gameInterval;


    $: {
      console.log("LEVEL CHANGED")
      console.log(level);
      if (level== 0){
        BOARD_SIZE = 2;
      } else if (level==1){
        BOARD_SIZE = 3;
      }
      widthBoard = 250;
      rowHeight = widthBoard / BOARD_SIZE;
      newGame();
    }


    let started = false;

    let feedbackItems = {'drag': 'Drag the toolbox commands into the program and press play!',
                          'incorrect': 'Make sure to water all the plants!',
                          'correct': 'Great job! All the plants are watered! You completed Level 0!',
                          'collision': 'You can\'t walk outside the field!',
                          'bad indent': 'Your indents are not correct!',
                          'start indent': 'Your first command should not be indented!'
                        }; 


    const XYZ_COLORS = ['#FF4040','#40A040','#5050F1']
    const XYZ_SHADES = ['#000000','#1D1D1D','#444444','#C4C4C4','#E5E5E5','#FFFFFF']

    let stepIndex = -1;
    stepI.subscribe(value => {
      stepIndex = value;
    });

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
        board = [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(0));
        boardWater = [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(0));
        charPosition = [0, 0];
    }


    function updatePosition(position) {
      charPosition = position;
    }

    function addSaplings(){
      let pos = Math.floor(BOARD_SIZE / 2);
      board[pos][pos] = SAPLING_CELL;
    }

    function updateFeedback(key){
      let newItem = feedbackItems[key]
      feedback.update(n => newItem)
    }

    function outOfBounds(){
      console.log("cant move that way!")
      updateFeedback("collision")
      stop()
    }


    function checkForCollision(position) {
        const [x, y] = position;

        if (x < 0 || x === BOARD_SIZE || y < 0 || y === BOARD_SIZE) return outOfBounds();
        // if (board[x][y] === SNEK_CELL) return gameOver();
        // if (board[x][y] === FOOD_CELL) return eatFood(position);

        return updatePosition(position);
    }

    function waterCell(position){
      const [x, y] = position;
      boardWater[x][y] = WET_CELL;
    }

    function stop() {
        clearInterval(gameInterval);
        stepI.update(n => -1)
        return
    }

    function move() {
        stepI.update(n => n+1)

        // if we are in a repeat section
        // check if we're at the end of the repeat section. if so, move back up.
        if (inRepeat){
          checkRepeat()
        }

        // check correct indent (if increase indent with no repeat, throw error)
        checkIndent()
        

        if (stepIndex >= stepsFormat.length) {
          checkSuccess();
          stop()
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
          case 'repeat':
            // if (breakRepeat){
            //   breakRepeat = false;
            //   return;
            // }
            // if (breakRepeat){
            //   // breakRepeat = false;
            //   return;
            // }
            if (!inRepeat) {
              console.log("FOUND REPEAT")
              repeatCount = repeatCounts[stepIndex]
              startRepeatIndex = stepIndex;
              inRepeat = true;
            }
            return;
        }
    }

    
    function checkIndent() {
      // check correct indent (if increase indent with no repeat, throw error)
      // remember indents are multiples of 50 

      // start with indent
      if (indents[0]!=0){
        updateFeedback('start indent');
        stop()
        return
      }
      // indent increases by more than 1
      if (indents[stepIndex]>indents[stepIndex-1]+50){
        updateFeedback('bad indent');
        console.log(indents[stepIndex])
        console.log(indents[stepIndex-1]+50)
        console.log("INDENT 1 CASE")
        stop()
        return
      }
      // indent increases by more than 1 without block starting
      if (indents[stepIndex]==indents[stepIndex-1]+50){
        if (inRepeat) {
          return
        } else {
          updateFeedback('bad indent');
          console.log("INDENT 2 CASE")
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
      if (stepIndex == stepsFormat.length || indents[stepIndex]<=indents[startRepeatIndex]) {
        repeatCount -= 1;
        console.log(repeatCount)
        // if we've repeated X number of times, stop!
        if (repeatCount <= 0){
          breakRepeat = true;
          inRepeat = false;
          return;
        }
        // if more repeats to do, restart section
        stepI.update(n => startRepeatIndex)
      }
    }



    function checkSuccess() {
      console.log("Success!")
      let watered;
      watered = allWatered()
      if (watered){
        updateFeedback('correct');
      } else {
        updateFeedback('incorrect');
      }
    }

    function allWatered(){
      for (let outer = 0; outer < BOARD_SIZE; outer ++){
        for (let inner = 0; inner < BOARD_SIZE; inner ++){ 
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
        stepI.update(n => -1)
        if (started) {
          reset();
        }
        started = true;
    
        gameInterval = setInterval(move, 750);
    }

    function reset() {
        newGame();
    }

    newGame();
    
  </script>
  
  <div class="wrapper">

  
  <h2>field</h2>


  <div class="field" style="grid-template-columns: repeat({BOARD_SIZE}, 1fr); grid-auto-rows: {rowHeight};">
      {#each board as row, outerIndex}
        {#each row as cell, index}
          <div class="cell" class:character={charPosition[0]==outerIndex && charPosition[1]==index}
          class:sapling={board[outerIndex][index] == SAPLING_CELL} class:watered={boardWater[outerIndex][index] == WET_CELL}>
            <!-- {#if board[outerIndex][index] === 1}
              <Character {choiceChar}/>
            {:else if board[outerIndex][index] === 0}
              <Sapling {level}/>
            {/if} -->
            
            <div class="characterSVG" class:hideCell={charPosition[0]!=outerIndex || charPosition[1]!=index}>
              <Icon name={charSelect} width="{widthBoard / BOARD_SIZE}px" height="{widthBoard / BOARD_SIZE}px" class="large"/>
            </div>
          </div>
        {/each}
      {/each}
  </div>

  <div class="controls">
    <button on:click={start}> Play</button>
    <button on:click={reset}> Restart</button>
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
        margin: 1em auto;
        display: flex;
        justify-content: center;
    }

    .field {
        width: 250px;
        height: 250px;
        margin: 0 auto;
        background-color: rgb(245, 245, 245);        
        position: relative;
        display: grid;
    }
    .wrapper {
        position: relative;
        padding: 0.5em;
        margin: 0.5em;
        width: 280px;
        border: solid black 1px;
        display:flex;
        flex-direction: column;
        flex-wrap: wrap;
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
      margin: 10px auto;
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
  
  
  
  