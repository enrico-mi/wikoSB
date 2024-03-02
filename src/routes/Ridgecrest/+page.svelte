<script>
import { base } from "$app/paths";

import Header from '$lib/Header.svelte';
import Ridgecrest from '$lib/Ridgecrest.svelte';

let password = '';
let accessGranted = false;

</script>

<nav>
    <a href="{base}/">home</a>
</nav>

<Header />

<h1>
    Mapping and Scientific Visualization:<br>Ridgecrest 2019
</h1>
<br>
<p>
    Visualization: mapbox, P5.js, (Chroma.js) <br>
    Data analysis: MATLAB, (C++)
    <br>
    <br>
    What follows is an interactive visualization that I made while studying surface ruptures that formed during the sequence of earthquakes that hit the region of Ridgecrest, California, in 2019. The work is part of my research stay at MIT. At the moment, the page is thought as an integral part of the scientific manuscript, therefore the language that describes how to navigate it is technical.
</p><br>

    <Ridgecrest />

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


