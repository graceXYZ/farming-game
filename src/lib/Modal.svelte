<script>
    export let shown = false;
    export function show() {
      shown = true;
    }
    export function hide() {
      shown = false;
    }
  </script>
  
  <style>
    .modal-wrapper {
      /* background-color: rgb(0, 0, 0); */
      background-color: rgba(0, 0, 0, 0.75);
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 100;
    }
  
    .modal {
      background-color: rgb(235, 235, 235); 
      width: 800px;
      max-width: 95%;
      min-height: 420px;
      height: max-content;
      padding: 1rem;
      position: relative;
      z-index: 101;
      margin: 4em auto;
      overflow-y: scroll;
    }

    .close {
        float: right;
        cursor: pointer;
    }
    .close:hover {
      font-weight: bold;
    }

    @media (width < 640px) {
      .modal {
        font-size: 14px;
      }
      
    }

   
  </style>
  
  <svelte:window
    on:keydown={e => {
      if (e.keyCode == 27) {
        hide();
      }
    }} />
  
  {#if shown}
    <div class="modal-wrapper">
      <div class="modal">
        <span class="close" on:click={hide}>&times;</span>
        <slot />
      </div>
    </div>
  {/if}
  