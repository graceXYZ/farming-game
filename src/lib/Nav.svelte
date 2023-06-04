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

</script>
  
<nav>
    <ul>
      <li><a href="{base}/">Home</a></li>
      <li><a href="{base}/game/">Game</a></li>
      <li><a href="{base}/progress/">Progress</a></li>
    </ul>

    <ul class="character">
      <li class="namegrid"> {name ? name : ""} </li>
      <!-- <li class="levelCheckWrap"> 
        <div class="levelCheck">0</div>
        <div class="levelCheck">1</div>
        <div class="levelCheck">2</div>
        <div class="levelCheck">3</div>
        <div class="levelCheck">4</div>
      </li> -->
    </ul>
    
</nav>

<style>
    .levelCheck {
        width: 25px;
        height: 25px;
        border: 1px black solid;
        margin: 0 1px;
        text-align: center;
    }
    .namegrid {
        grid-column: 1;
        padding: 0 15px;
    }
    .levelCheckWrap {
        width: 160px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-column: 2;

    }
    nav {
        display: grid;
        grid-template-columns: 60% 40%;
        align-items: right;
    }
    .character {
        width: 100%;
        justify-content: right;
        text-align: right;
        font-weight: bold;
        grid-column: 2;
        display: grid;
        padding-right: 0;
        /* grid-template-columns: 100px 150px; */
    }

    nav ul {
        list-style: none;
        padding: 3px 5%;
        background: #cacafa;
        color: #000000;
    }

    a {
        color: #000000;
        text-decoration: none;
    }

    li {
        display: inline;
        padding: 0 10px;
    }

    @media screen and (width < 580px) {
        /* .namegrid {
            display: none;
        } */
        li {
            padding: 0 1px;
        }
    }

</style>