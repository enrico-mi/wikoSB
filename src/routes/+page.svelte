<script>
import { base } from "$app/paths";

import Header from '$lib/Header.svelte';
import Home from '$lib/Home.svelte';
</script>

<main>
    <div id="root">
	
	<nav class="nav-about">
	    <a href="{base}/about">About</a>
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


