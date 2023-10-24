<script>
import Header from '../../components/Header.svelte';

</script>

<nav>
    <a href="/">home</a>
</nav>

<Header />

<h1>
    Object Tracking <span>&#8212;</span> Analogue Gravity Fringes
</h1>
<br>
<p>
    Visualization and analysis: Python, OpenCV <br>
    <br>
    This video showcases an object-tracking algorithm developed for an exhibit prototype of the scicommhack at CERN (13-15 Nov. 2020). The exhibit aims at describing gravity fringes with the membrane analogy, where marbles rolling on an elastic membrane are the analogy for celestial bodies moving in the outer space. As celestial bodies generate gravitational waves that travel in space-time, marbles generate elastic waves that travel on the membrane. <br>
    I developed an algorithm to track the marble and the waves it generates along its passage, to enhance the message for the visitor (elastic waves are actually too small to be appreciated by naked eye).
</p>

<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/aLM8rlXZX40"
    frameborder="0"
    allowfullscreen
></iframe>

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
</style>


