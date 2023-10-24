<script>
import Header from '../../components/Header.svelte';

//import img from '/images/efap/MG.png';

</script>

<nav>
    <a href="/">home</a>
</nav>

<Header />

<h1>
    AI Filmmaking <span>&#8212;</span> Threaded Memories
</h1>
<br>
<p>
    Footage generation: Runway Gen-1 and Gen-2 <br>
    <br>
    This short film was made during the Gen48 challenge, where teams had 48 hours to make a 1 to 4-minute long film, using AI-generated footage.

    Story and experimentation are king, and as such my teammates and I decided to avoid telling dystopic stories on the interaction between AI and humans, that would have easily justified the AI-hallucinated images, and focus on crafting a timeless story that could be told exploiting the peculiarties of this means of video generation.
</p>
<br>
<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/iA9WY1kRQTU?si=CERGYk9xMTnokOpx"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
</iframe>


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

.image {
    text-align: center;
    width: auto;
    height: 30vw; /* Automatically adjust height while maintaining aspect ratio */
}

</style>


