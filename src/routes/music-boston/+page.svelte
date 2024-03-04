<script>

import { base } from "$app/paths";

import Header from '$lib/Header.svelte';

</script>

<nav>
    <a href="{base}/">home</a>
</nav>

<Header />

<h1>
    Visualization of Georeferenced Data:<br> Boston Music Scene
</h1>
<br>

<p>
    Visualization: D3.js <br>
    Data gathering and cleaning: python, Ticketmaster API <br>
    <br>

    (NB: Work in progress.)
    <br><br>
    The goal of this project was to practice with  <a href="https://observablehq.com/d/0662d7c2f76df07a"> Observable notebooks</a>, and combining D3.js versatility and my passion for live music in a visualization.
    <br>
    The visualization answers the question "Which venue plays what genres?" <span>&#8212;</span> I have lived in a couple of different countries, and every time I move to a new place it takes me a while to learn which venues host concerts that are up my alley. Here, I wanted to create a tool that takes data downloaded through Ticketmaster's API, and quickly visualizes where the venues are, and how the music genres are shared within their program. I gathered data only for concerts in the 101 municipalities administered by the Metropolitan Area Planning Council, present in the Ticketmaster database as of December 2023.
    <br>
    To explore the data, move your cursor on top of one of the venues (blue circles): a plot showing the relative amount of concerts per genre at the venue will pop up. Move your cursor out of the venue's circle to remove the genres' plot. You can zoom in and out, and pan. The larger a circle, the larger the number of concerts in that venue's program.
    <br>
    An obvious limitation is that if a venue or event is not on Ticketmaster, it is not in my visualization either <span>&#8212;</span> unfortunately other APIs are expensive, and Ticketmaster still contains a remarkable amount of data. The choice of depicting the metropolitan Boston area by ZIP codes, instead of plotting the venues on top of a classical map, is due to my desire to experiment with this type of visualization.

    <br><br>
    The Observable notebook, with some more details and a walkthrough, is <a href="https://observablehq.com/d/0662d7c2f76df07a"> here</a>.

    <br>

    <iframe width="100%" height="885" frameborder="0"
	    src="https://observablehq.com/embed/0662d7c2f76df07a@786?cells=bostonMusicViz"></iframe>

    
</p>

<style>
h1 {
    width: 500px;
    text-align: center;
    margin: 0 auto
}

p {
    width: 1000px;
    text-align: justify;
    margin: 0 auto
}

nav {
    text-align: center;
    margin: 0 auto
}

.svg-tooltip{
    background-color: #fffff3;
}

</style>


