<script>
import Header from '../components/Header.svelte';
import Home from '../components/Home.svelte';
</script>

<main>
    <div id="root">
	
	<nav class="nav-about">
	    <a href="/about">About</a>
	</nav>

	<Header />
	
	<div class="body">
	    <Home />
	</div>
    </div>
</main>




<style>
@import './style.css';
</style>


