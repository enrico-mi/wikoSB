<script>
import { base } from "$app/paths";

import Header from '$lib/Header.svelte';
import Ridgecrest from '$lib/Ridgecrest.svelte';

let password = '';
let accessGranted = false;

function checkPassword() {
    // Replace 'your_password' with the actual password you want to use
    if (password === 'ciao') {
	accessGranted = true;
    } else {
	accessGranted = false;
    }
}
</script>

<nav>
    <a href="{base}/">home</a>
</nav>

<Header />

<h1>
    Ridgecrest 2019
</h1>
<br>
<p>
    Visualization: mapbox, P5.js, (Chroma.js) <br>
    Data analysis: MATLAB, (C++)
    <br>
    <br>
    What follows is an interactive visualization that I made while studying surface ruptures that formed during the sequence of earthquakes that hit the region of Ridgecrest, California, in 2019. The work is part of my research stay at MIT <span>&#8212;</span> the scientific paper is currently under revision. At the moment, the page is thought as an integratal part of the manuscript, and as such the language that describes how to navigate it is technical, but I am also working on a version accessible to a broader audience.
</p>
{#if accessGranted}
    <Ridgecrest />
{:else}
    The remaining content of this page is currently restricted as it relates to scientific work not yet published. <br>
    If you believe you should have access to it but do not have the right password, please contact me at milanese.e[at]gmail.com.
    <br><br>
  <!-- Password Input Form -->
  <form on:submit|preventDefault={checkPassword}>
    <label for="password">Enter the password:</label>
    <input type="password" id="password" bind:value={password} />
    <button type="submit">Submit</button>
  </form>
{/if}

<style>
h1 {
    width: 500px;
    text-align: center;
    margin: 0 auto
}

p {
    width: 1000px;
    text-align: center;
    margin: 0 auto
}

nav {
    text-align: center;
    margin: 0 auto
}
</style>


