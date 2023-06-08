<script>
    import { base } from "$app/paths";
    import '../styles.css';

    import {nameStore} from '../lib/stores.js';
    let name = "";
    nameStore.subscribe(value => {
        name = value;
    });

    import {successLOCAL} from '../lib/stores.js';
    let success = [0,0,0,0,0];
    successLOCAL.subscribe(value => {
      let readVal = value;
      success = JSON.parse(value);
      console.log("SUCC VAL RECEIVED " + success);
    });

    import { page } from '$app/stores';

    let currPath;
    
    $: {currPath = $page.url.pathname;}


</script>
  
<nav class="wrap">
    <!-- ok -->

    <ul class="character">
      <li class="namegrid">{name ? ("Hi, " + name + "!") : ""}</li>
      <!-- <li class="levelCheckWrap"> 
        <div class="levelCheck">0</div>
        <div class="levelCheck">1</div>
        <div class="levelCheck">2</div>
        <div class="levelCheck">3</div>
        <div class="levelCheck">4</div>
      </li> -->
    </ul>

    <ul class="pages">
        <li><a class:selected={currPath=="/"} href="{base}/">Home</a></li>
        <li><a class:selected={currPath=="/game"} href="{base}/game/">Game</a></li>
        <li><a class:selected={currPath=="/progress"} href="{base}/progress/">Progress</a></li>
    </ul>
    
</nav>

<style>
    .wrap {
        display: flex;
        justify-content: space-between;
        padding: 3px 0px;
        background: #cacafa;
        color: #000000;
    }

    .selected {
        text-shadow: #000000;
        border-bottom: 0.5px black solid;
        /* background/-color: black; */
    }
    .levelCheck {
        width: 25px;
        height: 25px;
        border: 1px black solid;
        margin: 0 1px;
        text-align: center;
    }
    .namegrid {
        grid-column: 1;
        grid-row: 1;
        padding: 0 15px;
    }
    
    .levelCheckWrap {
        width: 160px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-column: 1;
        grid-row: 1;
    }
    .pages {
        display: flex;
        padding-right: 15px;
        justify-content: right;
        gap: 40px;
    }

    nav {
        display: grid;
        /* grid-template-columns: 60% 40%; */
        align-items: right;
    }

    .character {
        display: flex;
        justify-content: right;
        text-align: right;
        font-weight: bold;
        grid-column: 1;
        padding-right: 0;
        /* grid-template-columns: 100px 150px; */
    }

    nav ul {
        justify-content: right;
        list-style: none;
        grid-row: 1;
    }

    a {
        color: #000000;
        font-family: 'Fira Code';
    }

    li {
        display: inline;
        /* padding: 0 10px; */
        font-family: 'Fira Code';
    }

    @media (width < 600px) {
        .pages {
            justify-content: right !important;
            gap: 12%;
        }

    }

</style>