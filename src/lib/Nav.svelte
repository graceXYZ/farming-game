<script>
    import { base } from "$app/paths";
</script>
  
<nav>
    <ul>
      <li><a href="{base}/">Home</a></li>
      <li><a href="{base}/level0/">Level 0</a></li>
    </ul>
</nav>

<style>
    nav ul {
        list-style: none;
        padding: 3px 5px;
        background: #111;
    }

    a {
        color: #fff;
        text-decoration: none;
    }

    li {
    display: inline;
    }

</style>