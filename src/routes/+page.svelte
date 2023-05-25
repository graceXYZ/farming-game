<script>
    import '../styles.css';
    export let data;
    import SignIn from '../lib/SignIn.svelte';

</script>

<!-- <h1 style="margin:1em; text-align: center" class:hide={data.visited!="true"}>Hello {data.name}! You chose character {data.character}</h1> -->

<SignIn {data}/>

<style>
    .hide {
        display: none;
    }

</style>
