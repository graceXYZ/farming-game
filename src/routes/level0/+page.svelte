<script>
    import Draggable from '../../lib/Draggable.svelte';
    import Animation from '../../lib/Animation.svelte';
  
    import Modal from "../../lib/Modal.svelte";
  
    import {feedback} from '../../lib/stores.js';
  
    let modal;
    let programData;
  
    import {levelStore} from '../../lib/stores.js';
    let level = 0;
  
    levelStore.subscribe(value => {
      level = value;
      });
  
    let feedbackThis = "";
    feedback.subscribe(value => {
          feedbackThis = value;
      });
  
    function changeLevel(){
      levelStore.update(n => level)
    }
  
  </script>
  
  
  <main>
  

    <div class="wrapElements">
        
        <div class="wrap">
            <Draggable/>
            <Animation/>
        </div>
    
      <Modal bind:this={modal}>
        <h2 style="margin-bottom: 0.1em">Welcome to The Sugar Shortage</h2>
        <div class="ModalText"> 
        <p>You are visiting a sugar beet farm to help figure out why all the beet plants are dying!</p>
        <p>Your first task is to make sure all the plants are watered.</p>
        <p>Using the toolbox commands on the left, construct a program to move your character around the field and water the plants.</p>
        <br>
        <p>Press <strong>Play</strong> to activate your program, and <strong>Reset</strong> to try again. </p>
        <br>
        <p>When all the plants are watered, you can move on to the next level!</p>
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
          </select>
        
        </div>
        <div class="feedback"> {feedbackThis} </div>
      </div>

      

    </div>
  
    
    
    
  
    
  
  </main>
  
  <style>
    .wrap {
        display: flex;
        flex-direction: row;
        position: relative;
        justify-content: center;
        flex-wrap: wrap;
    }

    main {
        margin: 0 auto;
    }

    .ModalText {
      text-align: left;
      padding: 0.5em;
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
      margin-top: 2.5em;
      position: relative;
    }
  
    button {
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
      text-align: right;
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
  