<script lang="ts">
    let charOptions = ["femaleWhite","teacher","maleBrown"]

    import Icon from "./Icon.svelte";
    import {goto} from "$app/navigation"
    import {page} from "$app/stores"

    import {nameStore} from '../lib/stores.js';
    let name = "";
    nameStore.subscribe(value => {
        name = value;
    });
    let nameNew = name;


    import {emailStore} from '../lib/stores.js';
    let email = "";
    emailStore.subscribe(value => {
        email = value;
    });
    let emailNew = email;
    
    import {charSelectStore} from '../lib/stores.js';
    let selected = 0;
    charSelectStore.subscribe(value => {
        selected = parseInt(value);
    });
    
    function playGame(){
        console.log("SELECT NAME: "+nameNew)
        nameStore.update(n => nameNew)
        emailStore.update(n => emailNew)
        charSelectStore.update(n => selected)
        goto("/game")
    }

</script>

<div class="wrap">


<h2>Choose your character!</h2>
    <div class="charSelect">
        {#each charOptions as val,idx}
            <button on:click={()=>selected=idx} class="selectOption" class:selected="{selected==idx}">
                <div class="iconWrap">
                    <Icon name={idx} width="100px" height="100px" class="large"/>
                </div>
            </button>
        {/each}
    </div>

    <h2 style="margin-top:1em; margin-bottom: 0.5em;">Type your name!</h2>

    <div style="display:flex">
        <input style="margin-left: 5px; height:30px; font-size:20px; width: 200px;" bind:value={nameNew}/>
    </div>

    <h2 style="margin-top:1em; margin-bottom: 0.5em;">Type your unique ID!</h2>

    <input class="hidden" type="character" name="character" value={selected} />

    <div style="display: flex; gap: 10px; justify-content: space-between">
        <input style="margin-left: 5px; height:30px; font-size:20px; width: 200px;" bind:value={emailNew}/>
        <button class="submitButton" style="margin-top: 0em;" type="submit" on:click={playGame}>Let's Play!</button>    
    </div>

</div>

<style>
    .submitButton {
        
        display: flex;
        flex-wrap: wrap;
		flex-direction: row;
        width: 120px;
        padding: 0;
        
		/* padding: 5px 10px; */

        /* border: none; */
        height: 30px;
        justify-content: center;
        align-content: center;
        text-align: center;

		/* Grayscale/White */
		background: #ffffff;
        /* border: none; */
		border-radius: 3px;

        font-family: 'Roboto Flex Variable';
        font-style: normal;
        font-weight: 700;
        font-size: 1em;
    }
    
    .wrap {
        position: relative;
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