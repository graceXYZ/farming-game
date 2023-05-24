<script>
  import '../styles.css';
  import Nav from '../lib/Nav.svelte';
</script>

<Nav/>

<slot />

<style>
  nav {
    background-color: beige;
  }
  nav ul {
    display: flex;
  }
  li {
    list-style: none;
    margin: 15px;
  }
  a {
    text-decoration: none;
    color: black;
  }
</style>