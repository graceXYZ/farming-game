<script>

    import { steps} from '../lib/stores.js';
    import { indentsStore} from '../lib/stores.js';
    import { repCountsStore} from '../lib/stores.js';
    import { stepI } from '../lib/stores.js';
    import { feedback } from '../lib/stores.js';
    import { successStatusStore } from '../lib/stores.js';
    import { numStepsStore } from '../lib/stores.js';
    import { feedbackCodeS } from '../lib/stores.js';
    import { charSelectStore } from '../lib/stores.js';
    import {successStore} from '../lib/stores.js';
    import Icon from "./Icon.svelte";

    // let weedCheckPosition = 0;
    let currentWeedVal = -1; // -1 if not set. 0 if sapling. 1 if weed. 2 if dead.
    let nextStepIndexWeed = 0;
    let executeSkipBlockWeed = false;
    let resetPending = false;
    let finishedFirstIndexRep = false;

    let charSelect;
    charSelectStore.subscribe(value => {
      charSelect = value;
    });

    let numSteps = 0;
    numStepsStore.subscribe(value => {
      numSteps = value;
    });

    let successStatus = false;
    successStatusStore.subscribe(value => {
      successStatus = value;
    });

    import {successLOCAL} from '../lib/stores.js';
    let success = [0,0,0,0,0];
    successLOCAL.subscribe(value => {
      let readVal = value;
      success = JSON.parse(value);
      console.log("SUCC VAL RECEIVED " + success);
    });


    let startorPause = ["Play","Pause"]

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
    let boardInfected;
    let boardWeed;
    let blockedCells;
    let charPosition;
    let gameInterval;
    let boardCheckAllWeed;
    let boardRemoveAllWeed;

    let infectedPositions = [2,4,5,6,8];
    // badStatus -1 means not initialized, 0 means good, 1 means bad
    let level4Steps = {'initIndex_list': false, 
                        'initInfected_list': false, 
                        'iteratingThroughPositions': false, 
                        'badStatus': -1, 
                        'infectedList': [],
                        'currPositionVal': [0,0],
                        'forPositionStartIndex': -1
                        }

    let thresholdCommands = [100,12,10,10,10];
    
    let positionString = "undefined";
    let infectedListString = "undefined";
    let badString = "undefined";

    $: {
      console.log("LEVEL CHANGED")
      console.log(level);
      if (level== 0){
        BOARD_SIZE_W = 2;
        BOARD_SIZE_H = 2;
        widthBoard = 200;
        iterateTime = 750;
      } else if (level==1){
        BOARD_SIZE_W = 4;
        BOARD_SIZE_H = 2;
        widthBoard = 150;
        iterateTime = 600;
      } else if (level==2){
        BOARD_SIZE_W = 7;
        BOARD_SIZE_H = 3;
        widthBoard = 150;
        iterateTime = 500;
      } else if (level==3){
        BOARD_SIZE_W = 5;
        BOARD_SIZE_H = 1;
        widthBoard = 60;
        iterateTime = 600;
      } else if (level==4){
        BOARD_SIZE_W = 3;
        BOARD_SIZE_H = 3;
        widthBoard = 200;
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
                          'incorrectWeed': "There are weeds and/or dead beets :(",
                          'overwatered': "Oh no! A beet plant died from overwatering!",
                          'correctButTooLong': "Good, but your code is too long. Use repeats!",
                          'correctWeedButNotUniversal': "Good, but your code won't work if the weeds are in other locations. Check every block!"
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
      boardInfected = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      boardWeed = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      boardCheckAllWeed = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      boardRemoveAllWeed = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));
      blockedCells = new Array(BOARD_SIZE_H).fill(0).map(() => new Array(BOARD_SIZE_W).fill(0));

      successStatusStore.update(n=> false);
      
      if (level == 2){
        let blockedOuter = [0,1,1,2,2,3,4,4,5,5,6,6];
        let blockedInner = [2,0,2,0,2,0,0,1,0,1,0,1];
        for (let j=0; j < blockedOuter.length; j++){
          blockedCells[blockedInner[j]][blockedOuter[j]] = 1;
        }
      }
      
      // set infected blocks for level 4. 0 means not infected. 1 means infected.
      if (level == 4){
        for (let outer=0; outer < BOARD_SIZE_H; outer++){
          for (let inner=0; inner < BOARD_SIZE_W; inner++){
            let linInd = outer * BOARD_SIZE_W + inner;
            if (infectedPositions.includes(linInd)) {
              boardInfected[outer][inner] = 1;
            }
          }
        }
      }


      // fill weed with random vals
      let weedCheck = 0;
      let weedVal = 0;
      let healthyCheck = 0;
      for (let outer = 0; outer < BOARD_SIZE_H; outer ++){
        for (let inner = 0; inner < BOARD_SIZE_W; inner ++){ 
          // skip first block bc it may be inactivated 
          if (outer == 0 && inner == 0){
            continue;
          }
          weedVal = Math.floor(Math.random() * 2);
          boardWeed[outer][inner] = weedVal;
          if (weedVal == 1){ // make sure there is at least one weed and one healthy plant
            weedCheck = 1;
          }
          if (weedVal == 0) {
            healthyCheck = 1;
          }
        }
      }
      // make sure there is at least one weed and one healthy plant
      if (weedCheck == 0){
        boardWeed[BOARD_SIZE_H-1][BOARD_SIZE_W-1] = 1;
      }
      if (healthyCheck == 0){
        boardWeed[BOARD_SIZE_H-1][BOARD_SIZE_W-1] = 0;
      }
      
      charPosition = [0, 0];
      updateFeedback('drag')
      inRepeat = false;
      startRepeatIndex = [];
      // breakRepeat = [];
      currRepeatIndex = -1;
      repeatCountsLeft = [];
      finishedFirstIndexRep = false;
      level4Steps = {'initIndex_list': false, 
                        'initInfected_list': false, 
                        'iteratingThroughPositions': false, 
                        'badStatus': -1, 
                        'infectedList': [],
                        'currPositionVal': [-1,-1],
                        'forPositionStartIndex': -1
                        }
    }


    function updatePosition(position) {
      charPosition = position;
      nextStepIndex = stepIndex + 1;
    }

    function updateFeedback(key){
      let newItem = ""
      if (feedbackItems[key]){ 
        newItem = feedbackItems[key]
      } else {
        console.log("feedback value not found. using key")
        newItem = key
      }
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

        // is out of range
        if (x < 0 || x === BOARD_SIZE_H || y < 0 || y === BOARD_SIZE_W)  {
          return outOfBounds();
        }
        // is blocked
        // if (blockedCells[x][y]==1){
        //   return outOfBounds();
        // }
        // if (board[x][y] === SNEK_CELL) return gameOver();
        // if (board[x][y] === FOOD_CELL) return eatFood(position);

        return updatePosition(position);
    }

    function waterCell(position){
      const [x, y] = position;
      // if cell is blocked (over watered), stop and update feedback
      if (blockedCells[x][y]==1) {
        updateFeedback("overwatered")
        boardWeed[x][y] = 2;
        resetPending = true;
        stop();
      } else {
        boardWater[x][y] = WET_CELL;
      }
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
            return;

          case "index_list":
            dealWithLevel4([currX, currY, direction]);
            return;

          case "go_to":
            dealWithLevel4([currX, currY, direction]);
            return;

          case "for_position":
            dealWithLevel4([currX, currY, direction]);
            return;

          case "check_infection":
            dealWithLevel4([currX, currY, direction]);
            return;

          case "add_position":
            dealWithLevel4([currX, currY, direction]);
            return;

          case "infected_list":
            dealWithLevel4([currX, currY, direction]);
            return;

          case "if_bad":
            dealWithLevel4([currX, currY, direction]);
            return;
            
        }
        console.log("CASE NOT FOUND: " + direction);
    }

    function dealWithLevel4([currX, currY, direction]) {
      console.log("level4 activated")

      // let level4Steps = {'initIndex_list': false, 
      //             'initInfected_list': false, 
      //             'iteratingThroughPositions': false, 
      //             'badStatus': -1, 
      //             'infectedList': []
      //             }
      
      switch (direction) {

          case "index_list":
            level4Steps['initIndex_list'] = true;
            nextStepIndex = stepIndex + 1;
            break;

          case "go_to":
            // check curr position val
            if (level4Steps["currPositionVal"][0]==-1){
              resetPending = true;
              updateFeedback("position variable is not initialized!")
              stop();
              break;
            }
            charPosition = level4Steps["currPositionVal"]
            nextStepIndex = stepIndex + 1;
            break;
            
          case "for_position":
            console.log("for position");
            // if index_list not init, stop
            if (!level4Steps['initIndex_list']){
              resetPending = true;
              updateFeedback("'index_list' variable is not initialized!")
              stop();
              break;
            }
            // if more than one found!
            if (level4Steps['iteratingThroughPositions'] && stepIndex!=level4Steps['forPositionStartIndex']) {
              resetPending = true;
              updateFeedback("You can only iterate through the positions once!")
              stop();
              break;
            }

            // if not already started:
            if (!level4Steps['iteratingThroughPositions']) {
              level4Steps['iteratingThroughPositions'] = true;
              level4Steps["currPositionVal"] = [0,0]
              level4Steps['forPositionStartIndex'] = stepIndex;
            }
            
            positionString = level4Steps["currPositionVal"][0]*BOARD_SIZE_W + level4Steps["currPositionVal"][1];
            nextStepIndex = stepIndex + 1;
            return;

          case "check_infection":
            level4Steps['badStatus'] = boardInfected[currX][currY];
            badString = level4Steps['badStatus']==1; // 0 is not infected. 1 is infected
            nextStepIndex = stepIndex + 1;
            break;
            
          case "add_position":
            // if infected_list not init, stop
            if (!level4Steps['initInfected_list']){
              resetPending = true;
              updateFeedback("'bad_list' variable is not initialized!")
              stop();
              break;
            }
            // if we're iterating aka position is initialized
            if (level4Steps['iteratingThroughPositions']) {
              level4Steps['infectedList'].push(currX * BOARD_SIZE_W + currY);
              console.log("ADDING INDEX :" + level4Steps['infectedList'])
              infectedListString = '['+level4Steps['infectedList']+']';
              nextStepIndex = stepIndex + 1;
            } else {
              // if we havent started
              if (level4Steps['forPositionStartIndex']==-1) {
                console.log("'position' variable is not initialized!")
                updateFeedback("'position' variable is not initialized!")
                resetPending = true;
                stop();
              }
            }
            nextStepIndex = stepIndex + 1;
            break;
            
          case "infected_list":
            level4Steps['initInfected_list'] = true;
            infectedListString = '[]';
            nextStepIndex = stepIndex + 1;
            break;
            
          case "if_bad":
            // if bad not init, stop
            if (level4Steps['badStatus']==-1){
              resetPending = true;
              updateFeedback("'is_bad' variable is not initialized!")
              stop();
              break;
            }
            // if bad status is currently 1, continue into block
            if (level4Steps['badStatus']==1){
              nextStepIndex = stepIndex + 1;
              break;
            } else { // else, skip block
              // find next step index without this indent
              let nextStepIndexBad = stepIndex+1;
              while (nextStepIndexBad < stepsFormat.length && indents[nextStepIndexBad]>indents[stepIndex]){
                nextStepIndexBad += 1;                 
              }
              nextStepIndex = nextStepIndexBad;
              // if block goes to end of program and we are inside for loop, go back to beginning
              // if (nextStepIndexBad == stepsFormat.length && level4Steps['iteratingThroughPositions']) {
              //   nextStepIndex = level4Steps['forPositionStartIndex']
              // }
              break;
            }
      }

      // if in position iteration block, make sure it doesn't end
      if (level4Steps['iteratingThroughPositions'] && indents[stepIndex]<=indents[level4Steps['forPositionStartIndex']]) {
        let pos = level4Steps['currPositionVal'];
        let posLin = pos[0]*BOARD_SIZE_W + pos[1];
        if (posLin < BOARD_SIZE_W*BOARD_SIZE_H-1) {
          updateFeedback("Make sure you indent the commands inside the 'for' block")
          resetPending = true;
          stop();
          return;
        }
      }

      // if in position iteration block and it ends, restart block and go to next position
      if (level4Steps['iteratingThroughPositions'] && (nextStepIndex>=indents.length || indents[stepIndex+1]<=indents[level4Steps['forPositionStartIndex']])){
        // if at last index, break
        if (level4Steps['currPositionVal'][0]==2 && level4Steps['currPositionVal'][1]==2) {
          console.log("STOP ITERATION POSITION")
          level4Steps['iteratingThroughPositions'] = false;
          if (nextStepIndex < indents.length){
            nextStepIndex = stepIndex+1;
          }
          return;
        }
        nextStepIndex = level4Steps['forPositionStartIndex'];
        console.log("trying to update position")
        // if at position 0, go to same position
        // if (!finishedFirstIndexRep) {
        //   level4Steps['currPositionVal']= [0,0]
        //   finishedFirstIndexRep = true;
        //   return;
        // }
        // else, go to next
        let currCharPositionIndex = charPosition[0]*BOARD_SIZE_W + charPosition[1];
        let thisNextPosition = currCharPositionIndex+1;
        let thisNextY = thisNextPosition % BOARD_SIZE_W;
        let thisNextX = (thisNextPosition - thisNextY)/BOARD_SIZE_W;
        level4Steps['currPositionVal']= [thisNextX,thisNextY]
      }

    }


    function dealWithWeed([currX, currY, direction]){
      let vals = ['check weed','if weed','deweed'];

      // check_weed()
      if (direction == vals[0]) {
        // universal solution if all weeds are gone and for each block there is a check AND if statement with remove_weeds 
        boardCheckAllWeed[currX][currY] = 1; 
        // set current weed val
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
            // universal solution if all weeds are gone and for each block there is a check AND if statement with remove_weeds 
            console.log("SKIPPING STEPS CODES:" + stepsFormat[nextStepIndexWeed-1])
            if (stepsFormat[nextStepIndexWeed-1] == vals[2]) {
              boardRemoveAllWeed[currX][currY] = 1; 
            }
          }
          console.log("skipping to index: " + nextStepIndexWeed)
          nextStepIndex = nextStepIndexWeed;
        }

      } else {
        // remove_weed()
        // universal solution if all weeds are gone and for each block there is a check AND if statement with remove_weeds 
        boardRemoveAllWeed[currX][currY] = 1; 
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
      if (indents.length == 0){
        resetPending = true;
        stop();
        return;
      }
      if (indents[0]!=0){
        updateFeedback('start indent');
        resetPending = true;
        stop();
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
        if (stepsFormat[stepIndex-1]=='repeat' || stepsFormat[stepIndex-1]=='if weed' || stepsFormat[stepIndex-1]=='for_position' || stepsFormat[stepIndex-1]=='if_bad') {
          return
        } else {
          updateFeedback('bad indent');
          console.log("INDENT 2 CASE")
          resetPending = true;
          stop()
          return 
        }
      }
      // repeat, for ,or if header WITHOUT a repeated command next
      if (stepsFormat[stepIndex-1]=='repeat' || stepsFormat[stepIndex-1]=='if weed' || stepsFormat[stepIndex-1]=='for_position' || stepsFormat[stepIndex-1]=='if_bad') {
        if (indents[stepIndex-1]==indents[stepIndex]){
          let caseName = "";
          if (stepsFormat[stepIndex-1]=='repeat'){
            caseName = " repeat block"
          } else if (stepsFormat[stepIndex-1]=='for_position') {
            caseName = " for loop"
          } else {
            caseName = "n if statement block"
          }
          updateFeedback('You need to indent your commands in a' + caseName +"!");
          console.log("INDENT 3 CASE")
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
          console.log("CORRECT. NUM STEPS: " + numSteps)
          if (indents.length < thresholdCommands[level]){
            success[level]=1;
            successLOCAL.update(n=> JSON.stringify(success))
            successStatusStore.update(n=> true);
            console.log("UPDATE SUCCESS " + success);
            updateFeedback('correct');
          } else {
            updateFeedback('correctButTooLong');
          }
          
        } else {
          updateFeedback('incorrect');
        }
      } else if (level == 3) {
        let weeded;
        weeded = allWeeded();
        let universalSolution = checkUniversalWeedSolution();

        if (weeded && universalSolution){
          if (indents.length < thresholdCommands[level]){
            success[level]=1;
            successLOCAL.update(n=> JSON.stringify(success))
            console.log("UPDATE SUCCESS " + success)
            successStatusStore.update(n=> true);
            updateFeedback('correctWeed');
          } else {
            updateFeedback('correctButTooLong');
          }
          console.log("correct weed")
        } else if (weeded) {
            console.log(boardCheckAllWeed)
            console.log(boardRemoveAllWeed)
            updateFeedback('correctWeedButNotUniversal');
        } else {
            console.log("incorrect weed")
            updateFeedback('incorrectWeed');
        }
      } else { // level 4
        let includesAllPos = true;
        for (let i = 0; i < infectedPositions.length; i++){
          if (!level4Steps['infectedList'].includes(infectedPositions[i])) {
            includesAllPos = false;
            break;
          }
        }
        if (includesAllPos) {
          if (infectedPositions.length == level4Steps['infectedList'].length) {
            success[level]=1;
            successLOCAL.update(n=> JSON.stringify(success))
            updateFeedback('Awesome job! You successfully recorded all dying beets!');
            successStatusStore.update(n=> true);
          } else {
            updateFeedback('You successfully recorded all dying beets but somehow have duplicates..');
          }
          
        } else {
          updateFeedback('You did not successfully record all dying beets :(');
        }
      }
      
    }

    function checkUniversalWeedSolution() {
      for (let outer = 0; outer < BOARD_SIZE_H; outer ++){
        for (let inner = 0; inner < BOARD_SIZE_W; inner ++){ 
          if (outer==0 && inner == 0) {
            continue;
          }
          if (boardCheckAllWeed[outer][inner]==0 || boardRemoveAllWeed[outer][inner]==0) {
            return false;
          }
        }
      }
      return true;
    }

    function allWeeded() {
      for (let outer = 0; outer < BOARD_SIZE_H; outer ++){
        for (let inner = 0; inner < BOARD_SIZE_W; inner ++){ 
          if (level==3 && outer ==0 && inner==0){
            continue;
          }
          if (boardWeed[outer][inner] != 0 && blockedCells[outer][inner] != 1) { // if any are dead (2) or have weeds (1) AND not blocked
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
          if (boardWater[outer][inner] == DRY_CELL && blockedCells[outer][inner] != 1) {
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

  
  <h2 class="title">Field</h2>

  <div class="controls">
    <button class="playButton" on:click={start}> 
      <div class="playIcon">
        <Icon name=5 width="16px" height="15px"/>
      </div>
      <div class="playText">{startorPause[started]}</div>
    </button>
    <button class="playButton" on:click={reset}> 
      <div class="playIcon">
        <Icon name=8 width="14px" height="15px"/>
      </div>
      <div class="playText">Reset</div>
    </button>

  </div>

  <div class="fieldAndVars">

      <div class="field" class:fieldLevel4={level==4} class:fieldLevel0={level==0} style="grid-template-columns: repeat({BOARD_SIZE_W}, 1fr); grid-auto-rows: {rowHeight}; width:{BOARD_SIZE_W*rowHeight}px; height:{BOARD_SIZE_H*rowHeight}px">
          {#each board as row, outerIndex}
            {#each row as cell, index}
              <div class="cell" class:character={charPosition[0]==outerIndex && charPosition[1]==index}
              class:sapling={board[outerIndex][index] == SAPLING_CELL} 
              class:watered={boardWater[outerIndex][index] == WET_CELL}
              class:weed={level == 3 && boardWeed[outerIndex][index] == 1} 
              class:startBox={level==3 && outerIndex==0 && index == 0}
              class:dead={boardWeed[outerIndex][index] == 2}
              class:blocked = {blockedCells[outerIndex][index]==1}
              class:infected = {boardInfected[outerIndex][index]==1}
              >
                <!-- {#if board[outerIndex][index] === 1}
                  <Character {choiceChar}/>
                {:else if board[outerIndex][index] === 0}
                  <Sapling {level}/>
                {/if} -->
                <!-- {boardWeed[outerIndex][index]} -->
                <div class:hideCell={level!=4} class="indexText"> {outerIndex*BOARD_SIZE_W+index} </div>
                
                <div class="characterSVG" class:hideCell={charPosition[0]!=outerIndex || charPosition[1]!=index}>
                  <Icon name={charSelect} width="{rowHeight-10}px" height="{rowHeight-10}px" class="{level==4 ? "level4" : ""} {level==0 ? "level0" : ""}"/>
                </div>
                
              </div>
            {/each}
          {/each}
      </div>

      <div class="level4vars" class:hideCell={level!=4}>
        position = {positionString}
        <br>
        infectedList = {infectedListString}
        <br>
        bad = {badString}
      </div>

    </div>
  

</div>

  
  <style>
    .playButton {
      padding: 5px 8px;
      gap: 8px;

      width: 70px;
      
      border: none;
      height: 26px;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      /* Grayscale/White */
      background: #FFFFFF;
      border-radius: 2.5px;

      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;
    }

    .playIcon {
      position: relative;
      width: 12px;
      height: 15px;
      font-family: 'Font Awesome 6 Free';
      font-style: normal;
      font-weight: 900;
      font-size: 14px;
      line-height: 14px;
      display: flex;
      align-items: center;
      text-align: center;
    }


    .playText {
      font-family: 'Roboto Flex Variable';
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 16px;
      display: flex;
      align-items: center;
      text-align: center;

      /* Grayscale/Black */
      color: #000000;

      /* Inside auto layout */

      flex: none;
      order: 1;
      flex-grow: 0;
    }


    .title {
      width: 51px;
      height: 28px;

      /* Web/Mobile/H3/Default */

      font-family: 'Roboto Flex Variable';
      font-style: normal;
      font-weight: 100;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: center;
      margin: 0;
      /* Grayscale/Black */

      color: #000000;


      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;
    }


    .level4vars {
      font-size: 12px;
      line-height: 2em;
    }
    .indexText {
      font-size: 16px;
      position: absolute;
      top: 0px;
      left: 5px;
      color:lightgray;
    }
    .hideCell {
      display: none;
    }

    .characterSVG {
      position: absolute;
      top: 5px;
      left: 5px;
      width: 100%;
      height: 100%;
    }

    .sapling {
      background-color: rgba(64, 160, 64, 1);
    }

    .startBox {
      background: #E5E5E5 !important;
      /* border: none !important; */
    }

    .weed {
      background-color: rgb(160, 214, 60);
    }

    .blocked {
      background-color: rgb(30, 51, 66);
    }

    .dead {
      background-color: rgb(127, 88, 63) !important;
    }

    .watered {
      background-color: #20441C;
    }

    .infected {
      background-color: rgba(255, 64, 64, 1)
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
      border: 1.25px solid #FFFFFF;
      color: white;
    }

    .controls {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;
        gap: 10px;

        /* width: 555px; */
        height: 26px;

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }

    .controls button {
      padding: 0;
    }

    .field {
        margin: auto auto;
        background-color: rgb(245, 245, 245);        
        /* position: relative; */
        display: grid;
        margin: 0;

        /* width: 375px; */
        /* height: 250px; */
        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;

    }

    .wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 9px;
        /* width: 100%; */
        height: 100%;
    }
    
    .fieldAndVars {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0px;
      gap: 10px;
      min-width: 300px;
      flex-wrap: wrap;
      /* width: 100px; */

      /* width: 555px; */
      /* height: 250px; */


      /* Inside auto layout */
      flex: none;
      order: 2;
      /* align-self: stretch;
      flex-grow: 0; */
    }


    h2 {
      text-align: center;
      font-family: 'Roboto Flex Variable';
      font-style: normal;
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
      font-family: 'Roboto Flex Variable';
      font-style: normal;
      font-weight: 100;
      color: #000000;
      font-size: 1em;
      margin: 0 0.2em;
      border: 0.5px black solid;
    }

    @media (max-width: 1000px) {
      .fieldLevel4 {
        width: 150px !important;
        height: 150px !important;
      }
      .fieldLevel0 {
        width: 150px !important;
        height: 150px !important;
      }
    }

  </style>
  
  
  
  