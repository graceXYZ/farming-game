<script>
    import Draggable from '../../lib/Draggable.svelte';
    import Animation from '../../lib/Animation.svelte';
  
    import Modal from "../../lib/Modal.svelte";
  
    import {feedback} from '../../lib/stores.js';
    import {feedbackCodeS} from '../../lib/stores.js';

    import repeatImg from '../../lib/repeat.png';
    import repeat2Img from '../../lib/nestRepeat.png';
  
    let modal;
    let programData;
  
    import {levelStore} from '../../lib/stores.js';
    import { dataset_dev } from 'svelte/internal';
    
    let level = 0;
  
    levelStore.subscribe(value => {
      level = value;
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
      levelStore.update(n => level)
      modal.show()
    }

    function nextLevel(){
      console.log("next level")
      level += 1;
      changeLevel()
    }
  
  </script>
  
  
  <main>
  
    <div class="wrapElements">
        
        <div class="wrap">
            <Draggable/>
            <Animation/>
        </div>
    
      <Modal bind:this={modal}>
        

        <!-- LEVEL 0 -->
        <h2 class:hide={level!=0}  style="margin-bottom: 0.1em">Welcome to The Sugar Shortage</h2>
        <div class:hide={level!=0} class="ModalText"> 
          <p>You are visiting a sugar beet farm to help figure out why all the beet plants are dying!</p>
          <p>Your first task is to make sure all the plants are watered.</p>
          <p>Using the toolbox commands on the left, construct a program to move your character around the field and water the plants.</p>
          <br>
          <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to try again. </p>
          <br>
          <p>When all the plants are watered, you can move on to the next level!</p>
        </div>

        <!-- LEVEL 1 -->
        <h2 class:hide={level!=1}  style="margin-bottom: 0.1em">Level 1</h2>
        <div class:hide={level!=1}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px">It's the next day. The farm has expanded and you need to water all the plants again!</p>
          <p>To communicate more easily with your character, you have a new toolbox option to allow repeated commands!
            Create a <strong>repeat block</strong> by adding a single indent to each of following commands to be repeated.</p>
          <br>
          <br>
          <img src={repeatImg} alt="Repeat block example" width="200px" style="position:absolute; right:25px; top: 55px">
          <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to go back to the start. </p>
          
          <p>When all the plants are watered, you can move on to the next level!</p>
        </div>


        <!-- LEVEL 2 -->
        <h2 class:hide={level!=2}  style="margin-bottom: 0.1em">Level 2</h2>
        <div class:hide={level!=2}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px">It's the next day. The farm has expanded and you need to water all the plants again!</p>
          <p>You can now use <strong>nested repeats</strong> by adding repeat blocks inside of repeat blocks!</p>
          <br>
          <br>
          <img src={repeat2Img} alt="Repeat block example" width="200px" style="position:absolute; right:25px; top: 55px">
          <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to go back to the start. </p>
          
          <p>When all the plants are watered, you can move on to the next level!</p>
        </div>

        <button class="modalButton" on:click={() => modal.hide()}>Close</button>


        <!-- LEVEL 3 -->
        <h2 class:hide={level!=3}  style="margin-bottom: 0.1em">Level 3</h2>
        <div class:hide={level!=3}  class="ModalTextNarrow"> 
          <p style="margin-bottom: 15px"> WARNING! There are a lot of weeds growing among the beet seedlings. 
            You must go around and de-weed the plants before the weeds! But be careful, 
            You don't want to uproot the beet seedlings! 
            If there are weeds in a block, de-weed them. </p>
          <br>
          <img src={repeatImg} alt="Repeat block example" width="200px" style="position:absolute; right:25px; top: 55px">
          <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to go back to the start. </p>
          
          <p>When all the weeds are removed, you can move on to the next level!</p>
        </div>

        <button class="modalButton" on:click={() => modal.hide()}>Close</button>
      </Modal>


      <div class="footerWrap">
        <button on:click={() => modal.show()}>Show instructions</button>
        <div class="levelMessage"> Level
    
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
          </select>
        
        </div>
        <div class="feedback"> 
          {feedbackThis} 
          <button class="buttonNext" class:hide={feedbackCode!="correct"} on:click={nextLevel}> Next Level</button>
        </div>
      </div>

      

    </div>    
  
  </main>
  
  <style>
    .buttonNext {
      position: absolute;
      right:0;
      margin: 0px 10px;
      padding: 2px !important;
      width: 130px !important;
    }

    .hide {
      display: none;
    }

    .wrap {
        display: flex;
        flex-direction: row;
        position: relative;
        justify-content: center;
        flex-wrap: wrap;
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
    .modalButton {
          position:absolute;
          bottom: 0;
          right: 0;
          margin: 1em;
    }
  
    h1 {
      margin-bottom: 0.2em;
    }

    .wrapElements {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0;
      margin-top: 1.5em;
      position: relative;
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
  
    .levelMessage, .feedback {
      padding: 0.5em;
      text-align: center;
      min-width: 100px;
      background-color: rgb(245, 245, 245);
      border-radius: 6px;
    }
  
    .feedback {
      display: flex;
      text-align: right;
      position: relative;
    }
    
  
    .footerWrap {
        margin: 0.5em auto;
        width: 800px;
        max-width: 90%;
        min-width: 500px;
        height: 100px;
        display: grid;    
        gap: 15px;
        align-items: start;
        grid-template-columns: 175px 100px 1fr;
    }
  
    .footerWrap button {
      width: 175px;
    }
  
    
  
  </style>
  