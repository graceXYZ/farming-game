<script>

    import { steps} from '../lib/stores.js';
    import { indentsStore} from '../lib/stores.js';
    import { repCountsStore} from '../lib/stores.js';
    import { stepI } from '../lib/stores.js';
    import { feedback } from '../lib/stores.js';

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
              <svg style="width:{widthBoard / BOARD_SIZE}; height:{widthBoard / BOARD_SIZE}" viewBox="0 0 280 683" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M99.8989 30.0001C99.8989 21.7159 106.615 15.0001 114.899 15.0001H164.899C173.183 15.0001 179.899 21.7159 179.899 30.0001V105.819C179.899 117.59 173.015 128.274 162.295 133.138L144.031 141.425C141.405 142.617 138.393 142.617 135.767 141.425L117.503 133.138C106.783 128.274 99.8989 117.59 99.8989 105.819V30.0001Z" fill="#8B6730"/>
                <rect x="108.874" y="62.9496" width="25" height="17.5" rx="8.75" fill="white"/>
                <rect x="116.374" y="66.7495" width="10" height="10" rx="5" fill="#8B6730"/>
                <rect x="118.875" y="69.2496" width="5" height="5" rx="2.5" fill="black"/>
                <rect x="146.874" y="62.9496" width="25" height="17.5" rx="8.75" fill="white"/>
                <rect x="154.374" y="66.7495" width="10" height="10" rx="5" fill="#8B6730"/>
                <rect x="156.874" y="69.2496" width="5" height="5" rx="2.5" fill="black"/>
                <path d="M86.6006 79.2396C100.484 45.9562 136.241 -12.6204 168.201 19.3396C200.161 51.2996 189.284 47.0896 179.851 40.9896C163.751 33.7729 143.871 19.3396 193.151 19.3396" stroke="#4C381A" stroke-width="20" stroke-linecap="round"/>
                <path d="M193.15 79.2397C179.266 45.9564 143.51 -12.6203 111.55 19.3397C79.5895 51.2997 90.4662 47.0897 99.8995 40.9897C116 33.773 135.88 19.3397 86.5995 19.3397" stroke="#4C381A" stroke-width="20" stroke-linecap="round"/>
                <rect x="50.3138" y="164" width="40" height="194.4" rx="20" transform="rotate(15 50.3138 164)" fill="#8B6730"/>
                <path d="M45.1375 183.318C47.9963 172.649 58.963 166.317 69.6324 169.176C80.3017 172.035 86.6333 183.002 83.7745 193.671L52.7162 309.582L14.0792 299.229L45.1375 183.318Z" fill="#E6DED2"/>
                <rect x="190.951" y="174" width="40" height="194.4" rx="20" transform="rotate(-15 190.951 174)" fill="#8B6730"/>
                <path d="M196.127 193.319C193.268 182.649 199.6 171.683 210.269 168.824C220.938 165.965 231.905 172.297 234.764 182.966L265.822 298.877L227.185 309.23L196.127 193.319Z" fill="#E6DED2"/>
                <path d="M64.9503 168C64.9503 154.193 76.1432 143 89.9503 143H189.95C203.757 143 214.95 154.193 214.95 168V383H64.9503V168Z" fill="#FAF7F3"/>
                <rect x="125.17" y="383" width="30" height="80" fill="#A6C1E1"/>
                <rect x="65.1707" y="383" width="60" height="300" fill="#A6C1E1"/>
                <path d="M60.5723 658.9C60.5723 653.378 65.0494 648.9 70.5723 648.9H119.772C125.295 648.9 129.772 653.378 129.772 658.9V682.5C129.772 682.777 129.548 683 129.272 683H61.0723C60.7961 683 60.5723 682.777 60.5723 682.5V658.9Z" fill="#E5E5E5"/>
                <path d="M60.5723 679C60.5723 678.724 60.7961 678.5 61.0723 678.5H129.272C129.548 678.5 129.772 678.724 129.772 679V682.5C129.772 682.776 129.548 683 129.272 683H61.0723C60.7961 683 60.5723 682.776 60.5723 682.5V679Z" fill="#C4C4C4"/>
                <rect x="155.171" y="383" width="60" height="300" fill="#A6C1E1"/>
                <path d="M150.572 658.9C150.572 653.378 155.049 648.9 160.572 648.9H209.772C215.295 648.9 219.772 653.378 219.772 658.9V682.5C219.772 682.777 219.548 683 219.272 683H151.072C150.796 683 150.572 682.777 150.572 682.5V658.9Z" fill="#E5E5E5"/>
                <path d="M150.572 679C150.572 678.724 150.796 678.5 151.072 678.5H219.272C219.548 678.5 219.772 678.724 219.772 679V682.5C219.772 682.776 219.548 683 219.272 683H151.072C150.796 683 150.572 682.776 150.572 682.5V679Z" fill="#C4C4C4"/>
                </svg>
                
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
  
  
  
  