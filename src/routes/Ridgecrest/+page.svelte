<script>
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
    <a href="/">home</a>
</nav>

<Header />

<h1>
    Ridgecrest 2019
</h1>
<br>
{#if accessGranted}
    <p>
	Visualization: P5.js, (Chroma.js) <br>
	Data analysis: MATLAB, (C++)
	<br>
	<br>
	What follows is an interactive visualization that I made while studying surface ruptures that formed during the sequence of earthquakes that hit the region of Ridgecrest, California, in 2019. The work is part of my research stay at MIT <span>&#8212;</span> the scientific paper is currently under revision. At the moment, the page is thought as an integratal part of the manuscript, and as such the language that describes how to navigate it is technical, but I am also working on a version accessible to a broader audience.
    </p>
    <!-- <br>
	 <br>
	 The visualization describes the misfit between the orientation of each fracture as observed in the field, and the orientation predicted by analysis of the stress state.
	 For the heatmaps (left), each tile's color is directly proportional to the sum of squared residuals (SSR) of the weighted error of the predicted orientation of each fracture (see Methods section in the manuscript for definition and estimation), and where each row and column represents a value of &mu and of depth. The values of &mu explored are representative of the possible prevalent mechanism: shear failure (&mu between 0 and 1.5), tensile opening (&mu=1e16, i.e. &theta=0), and no prevalent mechanism (&mu ='random'). In the random case, each fracture's segment is compared to a different orientation given by &mu randomly drawn from the uniform interval (0, 1). While generally unphysical, we consider the values of &mu between 1 and 1.5 to understand the robustness of the physically accepted values (see Discussion in the manuscript). At each depth, orange borders surround neighboring tiles whose SSR is smaller than the one predicted by pure randomness, and an orange ring identifies the tile with the smallest SSR. For each matrix, an orange filled circle identifies the tile with the smallest SSR overall. Each heatmap is accompanied by a plot (right) of the region that shows the selection of fractures considered (in blue) and the orientations of left-lateral shear failure (orange lines), which appear and update when clicking on a tile of the heatmap. For these plots we have restrained ourselves to the left-later slip orientation for simplicity, and as that is the orientation observed for the high-angle fractures. <br>
	 <br>
	 The sliders below the heatmap allow to select different subsets of fractures and values of regional stress orientation as follows. <br>
	 Regional stress: orientation of the regional tectonic stress <br>
	 Fractures angle: switch between fractures oriented at any angle, and fractures oriented between N30E and N60E ('high angle fractures') <br>
	 Resolution: select minimum length at which fractures are resolved, any fracture shorter than the selected length is removed from the analysis <br>
	 Negative resolution: if 'Yes', reverese selection of 'Resolution' slider, i.e. it selects only fractures shorter than the selected resolution <br>
	 Verified: this relates to the property of the same name of the Ponti et al (2020) fractures dataset where the fractures I analyse are taken from. 'All': fractures partially and fully verified are considered; 'Yes' only fully verified fractures are considered <br>
	 Thompson Jobe et al (2020): 'No': no filter is applied to the dataset of Ponti et al (2020); 'Yes': fractures that are estimated to pre-date 2019 by Thompson Jobe et al (2020) are removed from the selection <br>
	 
	 </p> -->
    
    <Ridgecrest />
{:else}
    The content of this page is currently restricted as it relates to scientific work not yet published. <br>
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


