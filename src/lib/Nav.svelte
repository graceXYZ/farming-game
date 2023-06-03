<script>
    import { base } from "$app/paths";
    import '../styles.css';

    import {successStore} from '../lib/stores.js';
    let success = [];
    let currSum = 0;
    successStore.subscribe(value => {
        success = value;
        currSum = 0
        success.forEach(element => {
            currSum += element;
        });
    });

    import {nameStore} from '../lib/stores.js';
    let name = "";
    nameStore.subscribe(value => {
        name = value;
    });

    $:{
        console.log("LEVEL SCORE UPDATE" + success)
        currSum = 0
        success.forEach(element => {
            currSum += element;
        });
    }


</script>
  
<nav>
    <ul>
      <li><a href="{base}/">Home</a></li>
      <li><a href="{base}/game/">Game</a></li>
      <li><a href="{base}/progress/">Progress</a></li>
    </ul>

    <ul class="character">
      <li>{name} </li>
    </ul>
    
</nav>

<style>
    nav {
        display: grid;
        align-items: right;
    }
    .character {
        text-align: right;
        font-weight: bold;
        grid-column: 2;
        align-self: right;
    }

    nav ul {
        list-style: none;
        padding: 3px 10px;
        background: #cacafa;
        color: #000000;
    }

    a {
        color: #000000;
        text-decoration: none;
    }

    li {
    display: inline;
    padding: 3px 5px;
    }

</style>