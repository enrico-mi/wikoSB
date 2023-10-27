<script>
import { base } from "$app/paths";

import * as d3 from 'd3';

let acronymW = "W";
let acronymS = "S";
let acronymB = "B";
let acronymR = "R";

// Get letter height for the rectangular shape
//const rElement = document.querySelector('.acronym-W');
//let svgHeight = rElement.offsetHeight;

var rectHeight = 58;
var hFac = 0.6;
var areaGenerator = d3.area();
var areaPoints = [
    [0, rectHeight],
    [hFac*rectHeight, rectHeight],
    [hFac*rectHeight, 0],
    [0, 0]
];

var rectHeightRed = 28;
var areaPointsRed = [
    [0, rectHeightRed],
    [hFac*rectHeightRed, rectHeightRed],
    [hFac*rectHeightRed, 0],
    [0, 0]
];

// Get font size in px for blue shape
/* document.addEventListener("DOMContentLoaded", function() {
 *     var divElement = document.getElementById('blue-shape');
 *     var computedStyles = window.getComputedStyle(divElement);
 *     var fontSize = computedStyles.getPropertyValue('font-size');
 *     var fontSizeInPixels = parseFloat(fontSize);
 * });
 *  */
</script>

<main>
    <div class="body__intro">
	<h1 class="home-title">
	    Welcome to Wiko's Sketch<s>Book</s>
	    <svg id="blue-shape" class="logo-blue-screen" width={hFac*rectHeightRed} height={rectHeightRed}>
  		<g transform="translate(0, 0)">
		    <path
  			d={areaGenerator(areaPointsRed)}
		    />
		</g>
	    </svg>
	    .<br>
	</h1>
	<p class="home-desc">
	    This is my space to play with data visualization, and interactive, graphic, and web design. <br>
	    As such it's always alive! <br>
	    At times you might see my own notes, like boxes around </p><p class="bordered">elements</p><p class="home-desc"> to help me design them. <br>
	    Some pages might be under construction (forever, possibly). <br>
	    Or projects might <p class="grow"> grow into unexpected </p> <span class="directions"> directions.</span><br>
	    <p class="home-desc">I'm committed to always publish the ongoing state of the sketch<s>Book</s>
		<svg id="blue-shape" class="logo-blue-screen" width={hFac*rectHeightRed} height={rectHeightRed}>
  		    <g transform="translate(0, 0)">
			<path
  			    d={areaGenerator(areaPointsRed)}
			/>
		    </g>
		</svg>,
		keeping separate only developments that would break the website and make it inaccessible.
	    <!-- If you're familiar with version-controlling, I am trying to restrain myself to two branches: main and dev, with the rule that I work on dev, and at the end of each work session, as long as dev doesn't break the website, it is always merged into main to always mirror the current state of my Sketch<s>Book</s>
		 <svg class="logo-blue-screen" width={hFac*20} height={20}>
  		 <g transform="translate(0, 0)">
		 <path
  		 d={areaGenerator(areaPointsRed)}
		 />
		 </g>
		 </svg>.<br>
		 Of course, version history is the digital equivalent of scrolling through the pages of a paper notebook.
		 </p> -->
    </div>
    
    <div id="projects">
	<h1 class="proj-list">Projects</h1>

	<p> Projects vary in kind, you'll find a scientific visualization and an AI-generated narrative short film, too. Inside each page I also list the tools I have used for the specific project.

	<nav class="proj-item">
	    <a href="{base}/Ridgecrest">Mapping and Scientific Visualization <span>&#8212;</span> Ridgecrest 2019</a>
	</nav>
	
	<nav class="proj-item">
	    <a href="{base}/us-colleges-income">Data visualization <span>&#8212;</span> US colleges admission and household income</a>
	</nav>

	<nav class="proj-item">
	    <a href="{base}/object-tracking">Object Tracking <span>&#8212;</span> Analogue Gravity Fringes</a>
	</nav>

	<nav class="proj-item">
	    <a href="{base}/efap">Visual Analysis <span>&#8212;</span> Every Film A Painting</a>
	</nav>
	
	<nav class="proj-item">
	    <a href="{base}/gen48">AI Filmmaking <span>&#8212;</span> Threaded Memories</a>
	</nav>
	
    </div>
</main>

<style>

main {
    text-align: center;
    font-size: 24px;
    color: var(--color-text);
    margin-top: 0px;
}

/* p {
   line-height: 1;
   font-size: 24px;
   margin-top: 0px;
   margin-bottom: 0px;
   }
 */
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

.directions {
    transform: rotate(-10deg) translateY(-25px) translateX(10px);
    transform-origin: right bottom;
    line-height: 1.5em;
    display: inline-block;
    font-size: 35px;
}

.grow {
    font-size: 35px;
    display: inline;
}

</style>
