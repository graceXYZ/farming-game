<script lang="ts">
    export let data;

    let charOptions = ["femaleWhite","teacher","maleBrown"]

    import Icon from "./Icon.svelte";

    let selected = data.character;
    let defaultName = data.name;
    
    $:{
        console.log(data.character)
        charSelectStore.update(n => charOptions[data.character])
    }

    import {charSelectStore} from '../lib/stores.js';
    let charSelect = 0;
    charSelectStore.subscribe(value => {
        charSelect = value;
    });

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

<h2 style="margin-top:1em">Type your name!</h2>

<form method="POST" action="?/signIn">
    <div style="display:flex">
        <input style="margin-left: 5px; height:30px; font-size:20px" type="name" name="name"/>
        <p style="margin-left:10px"> {defaultName}</p>
    </div>
    <input class="hidden" type="character" name="character" value={selected} />
    <button style="margin-top: 2em" type="submit">Submit</button>
</form>

</div>

<style>
    .wrap {
        width: 500px;
        margin: 1em 1em;
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
        background-color: rgb(255, 0, 0) !important;
    }

    .selectOption {
        /* height: 120px;
        width: 120px; */
        position: relative;
        padding: 10px;
        width: 120px;
        height: 120px;
        background-color: rgb(255, 99, 99);
    }

    button {
        margin: 5px;
        border: black 0.5px solid;
    }

    .charSelect {
        display: flex;
        flex-wrap: wrap;
        width: 450px;
    }

</style>