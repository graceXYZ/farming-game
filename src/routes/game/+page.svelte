<script>
    import '../../styles.css';

    import { writable } from "svelte/store";

    import Draggable from '../../lib/Draggable.svelte';
    import Animation from '../../lib/Animation.svelte';
    import Icon from '../../lib/Icon.svelte';
  
    import Modal from "../../lib/Modal.svelte";
  
    import {feedback} from '../../lib/stores.js';
    import {feedbackCodeS} from '../../lib/stores.js';

    import repeatImg from '../../lib/repeat.png';
    import repeat2Img from '../../lib/nestRepeat.png';
    import conditionalImg from '../../lib/conditionalBlock.png';
    import forloopImg from '../../lib/forloop.png';
    import ifbadImg from '../../lib/ifbad.png';
    
  
    let modal = true;
    let modalSuccess = false;
    let programData;
    let level4Modalpage = true;

    function showModal(){
      modal = true;
    }

    function hideModal(){
      modal = false;
    }

    function hideModalS(){
      modalSuccess = false;
    }

    function toggleLevel4Modal(){
      level4Modalpage = !level4Modalpage;
    }

    import {successStatusStore} from '../../lib/stores.js';
    import {levelStore} from '../../lib/stores.js';

    import { dataset_dev } from 'svelte/internal';


    import {nameStore} from '../../lib/stores.js';
    let name = "";
    nameStore.subscribe(value => {
        name = value;
    });
    // nameStore.update(n => data.name)

    let successStatus = false;
    successStatusStore.subscribe(value => {
      successStatus = value;
    });


    import {successLOCAL} from '../../lib/stores.js';
    let success = [0,0,0,0,0];
    successLOCAL.subscribe(value => {
      let readVal = value;
      success = JSON.parse(value);
    });

    console.log("SUCCESS DEFINED"+ success)
    
    let level = 0;
    
    levelStore.subscribe(value => {
      level = value;
      modal = true;
    });
    
    let feedbackThis = "";
    feedback.subscribe(value => {
          feedbackThis = value;
      });

    let feedbackCode= "";
      feedbackCodeS.subscribe(value => {
        feedbackCode = value;
      });
  
    function changeLevel(){
      console.log(success)
      levelStore.update(n => level)
      // modal.hide()
      // modalSuccess.hide()
    }

    function nextLevel(){
      level = parseInt(level)+1;
      changeLevel()
    }

    function successFullGameFunction() {
      modalSuccess = true;
    }

    import { afterUpdate } from 'svelte';
    let element;
    afterUpdate(() => {
        console.log(element.textContent)
        if (element.textContent!="Drag the toolbox commands into the program and press play!"){
          flash(element);
        }
    });
    function flash(element) {
      requestAnimationFrame(() => { // instant red bg flash in
        element.style.transition = 'none';
        element.style.color = 'rgba(255,62,0,1)';
        element.style.backgroundColor = 'rgba(255,62,0,0.2)';

        setTimeout(() => {  // slow 1s fade out
          element.style.transition = 'color 4s, background 4s';
          element.style.color = '';
          element.style.backgroundColor = '';
        });
      });
    }
  
  </script>
  
  
  <main>
  
        <div class="wrap">
            <div class="draggable">
              <Draggable/>
            </div>
            <div class="animation">
              <Animation/>
            </div>
            <div class="info">
                  <div class="levelMessage"> 
                      <div class="levelDisplay">Level {level}</div>
                      <select class="levelSelect" bind:value={level} on:change="{changeLevel}">
                        <option value=0>
                          {0}
                        </option>
                        <option value=1>
                          {1}
                        </option>
                        <option value=2>
                          {2}
                        </option>
                        <option value=3>
                          {3}
                        </option>
                        <option value=4>
                          {4}
                        </option>
                      </select>
                  </div>
                  
                  <button class="instructionsButton" on:click={showModal}> 
                    <div class="nextButton">
                      <Icon name=7 width="14px" height="15px"/>
                    </div>
                    <div class="nextText">Show Instructions</div>
                  </button>

                  <div class="feedback"> 
                    <div class='feedbackName'>
                      Feedback:
                    </div>
                    <div class='feedbackText' bind:this={element}> {feedbackThis}  </div>
                    <button class="buttonNext" class:hide={!success[level] || level==4} on:click={nextLevel}> 
                      <div class="nextButton">
                        <Icon name=6 width="15px" height="12px"/>
                      </div>
                      <div class="nextText">Next Level </div>
                    </button>

                    <button class="buttonSuccess" class:hide={!success[level] || level<4} on:click={successFullGameFunction}> Click me! </button>
                  </div>
            </div>

      <Modal shown={modal}>
        
        <!-- LEVEL 0 -->
        <h2 class:hide={level!=0}  style="margin-bottom: 0.1em">Welcome to The Sugar Shortage</h2>
        <div class:hide={level!=0} class="ModalText"> 
          <p>You are visiting a sugar beet farm to help figure out why all the beet plants are dying!</p>
          <p>Your first task is to make sure all the plants are watered.</p>
          <br>
          <p>Using the toolbox commands on the left, construct a program to move your character around the field and water the plants. <strong>Drag the commands into the program</strong> in the desired order.</p>
          <br>
          <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to try again. </p>
          <br>
          <p>When all the plants are watered, you can move on to the next level!</p>
        </div>

        <!-- LEVEL 1 -->
        <h2 class:hide={level!=1}  style="margin-bottom: 0.1em">Level 1</h2>
        <div class:hide={level!=1}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px">Uh oh! Even with the watering yesterday, some of the beet leaves are turning yellow. What is happening?!
          Try watering the rest of the field to see if more water will help.</p>
          <!-- <br> -->
          <p>To communicate more easily with your character, you have a new toolbox option to allow repeated commands!
            Create a <strong>repeat block</strong> by adding a single indent to each of following commands to be repeated.</p>
          <br>
          <!-- <br> -->
          <img src={repeatImg} alt="Repeat block example" width="200px" style="position:absolute; right:25px; top: 85px">
          <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to go back to the start. </p>
          
          <p>When all the plants are watered, you can move on to the next level!</p>
        </div>


        <!-- LEVEL 2 -->
        <h2 class:hide={level!=2}  style="margin-bottom: 0.1em">Level 2</h2>
        <div class:hide={level!=2}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px">Uh oh! The beet leaves are turning even more yellow and their roots look thin and hairy. Maybe we are watering them too much?</p>
          <p>Avoid the areas that have already been watered (dark blue squares) and water only the plants that need them!</p>
          <br>
          <p>You can now use <strong>nested repeats</strong> by adding repeat blocks inside of repeat blocks!</p>
          <br>
          <img src={repeat2Img} alt="Repeat block example" width="200px" style="position:absolute; right:25px; top: 85px">
          <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to go back to the start. </p>
          
          <p>When all the plants are watered, you can move on to the next level!</p>
        </div>


        <!-- LEVEL 3 -->
        <h2 class:hide={level!=3}  style="margin-bottom: 0.1em">Level 3</h2>
        <div class:hide={level!=3}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px"> Uh oh! There are a lot of weeds growing among the beet seedlings. Maybe this is what is killing them!
            You must de-weed the field to see if this solves our problem! But be careful, don't uproot the beet seedlings!  </p>

          <p style="margin-bottom: 15px">
            You must <strong>check</strong> each block for weeds (light green blocks) using the <em>check_for_weeds()</em> function, which stores the output status (true or false) in the variable <em>weed</em>.
          <strong>If there are weeds, remove them</strong> by calling the <em>remove_weeds()</em> function. Make sure you create an <em>if-statement block</em> with indentations to indicate which commands should be run if <em>weed</em> is currently true.</p>

          <img src={conditionalImg} alt="Conditional block example" width="200px" style="position:absolute; right:25px; top: 85px">
          <p>When the weeds are removed and the beet plants are still alive, you can move on to the next level!</p>
        </div>


        <!-- LEVEL 4 PAGE 1-->
        <h2 class:hide={level!=4  || !level4Modalpage}  style="margin-bottom: 0.1em">Level 4</h2>
        <div class:hide={level!=4 || !level4Modalpage}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px"> You spent so much time carefully watering the plants, making sure not to over-water them. 
            You diligently checked the field for weeds and removed them. Still, the beet leaves are yellowing and you are quickly losing yield! 
            <em>What is the problem??? </em> </p>
          <p style="margin-bottom: 15px"> The only way forward is to study the beet symptoms more. You must <strong>inspect every plant and collect data</strong> on which locations of beets show these mysterious symptoms. </p>

          <p style="margin-bottom: 15px">
            To go through every block in the field, you will use a new method called a <strong>for loop</strong>. 
            For each index or numbered location in the field [ <em>for position in index_list:</em> ], you will go to the next location [ <em>go_to(position)</em> ] and perform some actions.
            All commands included in the for loop must be indended one degree more than the for loop header.
          </p>

          <img src={forloopImg} alt="For loop block example" width="200px" style="position:absolute; right:25px; top: 125px">
          
        </div>


        <!-- LEVEL 4 PAGE 2-->
        <h2 class:hide={level!=4 || level4Modalpage}  style="margin-bottom: 0.1em">Level 4 </h2>
        <div class:hide={level!=4 || level4Modalpage}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px"><strong>How can we store the locations of the beets that show symptoms?? </strong> 
             For each location, you will check for symptoms and store the locations of the bad beets in a list!</p>
          <p>
          </p>

          <p style="margin-bottom: 10px">
            To store the locations of the bad beets, you will first create an empty <strong>list</strong> of positions called <em>infected_list</em> at the beginning of the program <br>[ <em>infected_list = []</em> ].
          </p>
          <p style="margin-bottom: 10px">
            To check each block for symptoms, you will run the [ <em>bad = check_for_infection()</em> ] command at every position.
            <strong>If</strong> the current position is infected, you will <strong>add the current index</strong> to the list [ <em>add position to infected_list</em> ]. 
          </p>

          <p>Once you successfully record all infected locations, we can figure out what is wrong with these beets and restore sugar to the world!</p>

          <img src={ifbadImg} alt="If bad block example" width="200px" style="position:absolute; right:25px; top: 125px">
          
        </div>
        <button class="nextModalButton" class:hide={level!=4} style="{level4Modalpage ? '' : 'right: 110px;'}"  on:click={toggleLevel4Modal}>{level4Modalpage ? '->' : '<-'} Page {level4Modalpage ? 2 : 1}</button>

        <button class="modalButton" class:hide={level==4 && level4Modalpage} on:click={hideModal}>Close</button>

      </Modal>

      <Modal shown={modalSuccess}>

        <!-- SUCCESS FULL GAME -->
        <h2 class:hide={!success[4]}  style="margin-bottom: 0.1em">Congratulaions!!!</h2>
        <div class:hide={!success[4]}  class="ModalTextNarrow"> 
          <p>You successfully passed all levels of the Sugar Beet Shortage Farming Game!</p>
          <br>
          <p>
            You checked so many factors - overwatering, underwatering, weeding - and collected the dying beets. 
            These experiments have not told us exactly what's going on, but they have helped us eliminate factors and given us clues to the real reason... </p>
            <br>
            Now, head back to the course to finish solving this mystery and restore sugar to the world!
        </div>

        <button class="modalButton" on:click={hideModalS}>Close</button>
        
      </Modal>

      

    </div>    
  
  </main>
  
  <style>

    .feedbackText{
      /* width: 100%; */
      height: 12px;

      font-family: 'Roboto Flex Variable';
      font-style: normal;
      font-weight: 500;

      font-size: 10px;
      line-height: 12px;
      /* identical to box height */

      display: flex;
      align-items: center;

      /* Secondary/Orange */

      color: #FF9814;


      /* Inside auto layout */

      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 0;
    }

    .feedbackName {
      width: 56px;
      height: 14px;

      font-size: 12px;
      line-height: 14px;
      /* identical to box height */

      display: flex;
      align-items: center;

      /* Secondary/Orange */
      font-family: 'Roboto Flex Variable';
      font-style: normal;
      font-weight: 900;

      color: #FF9814;


      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;
    }

    .levelMessage {
      width: 185px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .levelSelect {
      width: 45px;
      height: 18px;
    }

    .levelDisplay {
      width: 85px;
      height: 28px;

      /* Web/Mobile/H3/Default */

      font-family: 'Roboto Flex Variable';
      font-style: normal;
      font-weight: 100;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: center;

      /* Grayscale/Black */

      color: #000000;


      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;
    }
    
    .draggable {
      grid-area: a;
      display: flex;
      order: 1;
      justify-self: right;
      flex: 0 0;
      /* justify-self: right; */
      /* float: right; */
      /* align-self: stretch;
      flex-grow: 0; */
    }
    .animation {
      grid-area: b;
      display: flex;
      flex-direction: column;
      /* flex-wrap: wrap; */
      align-items: flex-start;
      padding: 10px;
      gap: 10px;
      
      /* min-width: 200px; */
      width: 100%;
      /* max-width: 575px; */
      /* height: 340px; */

      /* Translucent/Grayscale/Black/5% */

      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;

      /* Inside auto layout */

      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 1;
      flex-shrink: 1;
    }

    .hidden {
      display: none;
    }
    
    .instructionsButton {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;
      padding: 5px 10px;
      gap: 20px;

      width: 153px;
      max-width: 153px;
      border: none;
      height: 26px;

      /* Grayscale/White */

      background: #FFFFFF;
      border-radius: 2.5px;

      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;
    }

    .buttonNext {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 5px 6px;

      gap: 15px;
      width: 105px;
      max-width: 105px;
      height: 26px;

      /* Grayscale/White */
      background: #FFFFFF;
      border-radius: 2.5px;
      border: none;

      /* Inside auto layout */

      flex: none;
      order: 2;
      flex-grow: 0
    }

    .nextButton {
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

    .nextText {
      font-family: 'Roboto Flex Variable';
      font-style: normal;
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

    .buttonSuccess{
       /* position: absolute;
      right:0;
      margin: 0px 10px; */
      margin-left: 10px;
      padding: 2px !important;
      width: 130px !important;
      grid-row: 0;
      grid-column: 1;
    }

    .hide {
      display: none;
    }

    .wrap {
      display: grid;
      width: min-content;
      max-width: 1210px;
      gap: 10px;
      grid-template-areas: "a b c";
      grid-template-areas:
        "a c"
        "a b";
      /* grid-template-columns: min-content min-content; */
      margin: 2em auto;

    }

    main {
        /* margin: 0 auto; */
    }

    .ModalText {
      text-align: left;
      padding: 0.5em;
    }
    .ModalTextNarrow {
      text-align: left;
      padding: 0.5em;
      width: 70%;
    }
    .nextModalButton{
      position:absolute;
          bottom: 0;
          right: 30px;
          margin: 1em;
    }
    .modalButton {
          position:absolute;
          bottom: 0;
          right: 0;
          margin: 1em;
    }
  
    h1 {
      margin-bottom: 0.2em;
    }

    button {
      background-color: white;
      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: 100;
      color: #000000;
      position: relative;
      margin: 0;
      border: 0.5px black solid;
    }
    
    .feedback {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 7.5px;
      gap: 5px;

      /* height: 114px; */

      /* Translucent/Orange/10% */

      background: rgba(255, 152, 20, 0.1);
      border-radius: 7.5px;

      /* Inside auto layout */

      flex: none;
      order: 2;
      align-self: stretch;
      flex-grow: 1;
      z-index: 2;
    }
    
  
    .info {
        grid-area: c;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-self: start;
        padding: 10px;
        gap: 10px;
        margin: 0;

        width: 100%;
        /* max-width: 575px; */

        /* width: 575px; */

        /* Translucent/Grayscale/Black/5% */

        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;

        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }
  
    .info button {
      width: 175px;
    }
  
    
  
  </style>
  