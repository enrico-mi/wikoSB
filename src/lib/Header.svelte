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

var rectHeightRed = 20;
var areaPointsRed = [
    [0, rectHeightRed],
    [hFac*rectHeightRed, rectHeightRed],
    [hFac*rectHeightRed, 0],
    [0, 0]
];

</script>

<main>
    <nav class="nav-about">
	<a href="{base}/about">about Wiko</a>
    </nav>

    <div class="header">
	<div class="header__logo">
	    <span class="acronym-W">W</span>
	    <span class="acronym-S">S</span>
	    <span class="acronym-B">B</span>
	    <svg class="logo-blue-screen" width={hFac*rectHeight+15} height={rectHeight}>
  		<g transform="translate(15, 5)">
		    <path
  			d={areaGenerator(areaPoints)}
		    />
		</g>
	    </svg>
	</div>
    </div>
</main>

<style>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap");

main {
    font-family: 'Josefin Sans', sans-serif;
    text-align: center;
    font-size: 24px;
    color: var(--color-text);
    /* margin-top: 5px;
       margin-bottom: 30px; */
}

    h1 {
        line-height: 1;
        font-size: 72px;
        /* margin-top: 10px;
           margin-bottom: 0px; */
    }

    path {
	fill: #2D6191;
    }

</style>
