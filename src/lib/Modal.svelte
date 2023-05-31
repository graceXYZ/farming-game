<script>
    let shown = true;
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
      background-color: rgba(212, 212, 212, 0.9);
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  
    .modal {
      background-color: white;
      max-width: 800px;
      height: 420px;
      padding: 1rem;
      position: relative;
      margin: 4em auto;
    }
    .close {
        float: right;
        cursor: pointer;
    }
    .close:hover {
      font-weight: bold;
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
        <span class="close" on:click={() => hide()}>&times;</span>
        <slot />
      </div>
    </div>
  {/if}
  