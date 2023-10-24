<script>
import * as d3 from 'd3';

import Header from '$lib/Header.svelte';

var hFac = 0.6;
var areaGenerator = d3.area();

var rectHeightRed = 20;
var areaPointsRed = [
    [0, rectHeightRed],
    [hFac*rectHeightRed, rectHeightRed],
    [hFac*rectHeightRed, 0],
    [0, 0]
];

</script>

<nav>
	<a href="/">home</a>
</nav>

<Header />

<h1>
    About
</h1>
<br>
<p> Hi! I am Enrico Milanese.<br>
    Some years ago I was running a workshop where children would make science films together with filmmakers and scientists. One of the children added my name to the credits, but did not know how to spell it and wrote Wiko. This is my space to freely explore and play with my creativity, with the same imagination and naivety of a child.
    <br>
    As this is a sketch<s>Book</s>
    <svg id="blue-shape" class="logo-blue-screen" width={hFac*rectHeightRed} height={rectHeightRed}>
  	<g transform="translate(0, 0)">
	    <path
  		d={areaGenerator(areaPointsRed)}
	    />
	</g>
    </svg>,
    it is alive, and over time its pages will host ideas that will keep evolving, ideas that will be abandoned as they were when jolted down, and ideas that will fly to or land from other life notebooks.

    <br>
    <br>
    P.S.: If you are curious, <a href="https://www.youtube.com/watch?v=rMeFmeyPzms&list=PLwS0cZFRgFCMy5e_7gRxNNRAvdExGRPSQ" target="_blank">this</a> is the video.
<br>
<br>
<br>
P.P.S.: If you are looking for my scientific activities, look
<a href="https://scholar.google.com/citations?user=TvgFeQcAAAAJ&hl=en&oi=ao" target="_blank">here</a>
or <a href="https://enrico-mi.github.io/" target="_blank">here</a>.
</p>

<style>
p,h1 {
    font-family: 'Josefin Sans', sans-serif;
    width: 700px;
    text-align: center;
    margin: 0 auto
}
/* body {
   height: 100vh;
   margin: 0;
   padding: 0;
   } */
s {
    text-decoration: line-through;
    /* Change the line thickness */
    text-decoration-thickness: 3px;
    /* Change the line color */
    text-decoration-color: #2D6191;
}
path {
    fill: #2D6191;
}
</style>


