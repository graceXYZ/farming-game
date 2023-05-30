<script lang="ts">
    export let data;

    let charOptions = ["femaleWhite","teacher","maleBrown"]

    import Icon from "./Icon.svelte";
    import {goto} from "$app/navigation"
    import {page} from "$app/stores"

    let selected = data.character;
    let defaultName = data.name;

    $: {
        if (!defaultName){
            defaultName = "";
        }
    }
    
    let visited = data.visited;

    import {charSelectStore} from '../lib/stores.js';
    let charSelect = "";
    charSelectStore.subscribe(value => {
        charSelect = value;
    });
    
    $:{
        console.log("SELECTED CHAR IS " + charOptions[selected])
        charSelectStore.update(n => charOptions[selected])
    }

    function playGame(){
        goto("/game")
    }

</script>

<div class="wrap">


<h2>Choose your character!</h2>
<div class="charSelect">
    {#each charOptions as val,idx}
        <button on:click={()=>selected=idx} class="selectOption" class:selected="{selected==idx}">
            <div class="iconWrap">
                <Icon name={val} width="100px" height="100px" class="large"/>
            </div>
        </button>
    {/each}
</div>

<h2 style="margin-top:1em; margin-bottom: 1em;">Type your name!</h2>

<form method="POST">
    <div style="display:flex">
        <input style="margin-left: 5px; height:30px; font-size:20px" type="name" name="name" value={defaultName}/>
        <!-- <p class:hidden={!visited} style="margin-left:10px"> {defaultName}</p> -->
    </div>
    <input class="hidden" type="character" name="character" value={selected} />
    <button style="margin-top: 2em;" type="submit" on:click={playGame}>Let's Play!</button>
</form>


</div>

<style>
    .wrap {
        max-width: 500px;
        margin: 1.5em auto;
        padding: 1em;
        background-color: rgb(246, 246, 246)    
    }

    .iconWrap {
        position: absolute;
        left: 5px;
        top: 10px;
        /* width: 100px;
        height: 100px; */
    }

    .hidden {
        display: none;
    }

    .selected {
        border: 1px blue solid;
        background-color: rgb(2, 138, 0) !important;
    }

    .selectOption {
        /* height: 120px;
        width: 120px; */
        position: relative;
        padding: 10px;
        width: 120px;
        height: 120px;
        background-color: rgb(146, 146, 146);
    }

    button {
        margin: 5px;
        background-color: white;
        border: black 0.5px solid;
    }

    .charSelect {
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        margin-top: 1em;
        /* width: 450px; */
    }

</style>