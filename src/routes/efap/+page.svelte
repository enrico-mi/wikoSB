<script>
import { base } from "$app/paths";

import Header from '$lib/Header.svelte';

    //import img from '/images/efap/MG.png';

</script>

<nav>
    <a href="{base}/">home</a>
</nav>

<Header />

<h1>
    Visual Analysis:<br> Every Film A Painting
</h1>
<br>
<p>
    Visualization and analysis: Python, OpenCV <br>
    <br>
    This project was born as a means for me to learn about the use of colours in film. For each film two images are produced, one in the RGB colour space and another one in gray scale. Each pixel of each image displays the average colour of the pixel during the whole film. The gray scale image is a simple conversion of the RGB one, the aim being to look at brighter and darker areas. For films originally in black and white, only the gray scale version is produced.
    <br>
    For some films I will included furhter images that I find visually interesting, where before averaging the pixel colour, I alter the frame by adjusting contrast or brightness, in different colour spaces. <br>

    I was glad to learn that Jason Shulman did something very similar with digital cameras in his <a href="https://www.jasonshulmanstudio.com/photographs-of-films" target="_blank"> <i>Photographs of films</i></a> work. His approach is less digital then mine: he set up a camera in front of a screen and set the exposure to the film length, such that the whole film was captured in one picture. I find it interesting that in my studies I could never reproduce his more vivid pictures, probably because of the less controlled nature of analogue studies compared to purely computational ones.
</p>
<br>
<p class="image"> Voyage dans la Lune
    <img src="{process.env.NODE_ENV === 'development' ? '/efap/' : '/wikoSB/efap/'}Voyage_rgb_8bit.png" alt="voyage" class="image" />
</p>
<br><br>

<p class="image"> Bo Burnham's Inside
    <img src="{process.env.NODE_ENV === 'development' ? '/efap/' : '/wikoSB/efap/'}BB_whole_rgb_8bit.png" alt="inside" class="image" />
</p>
<br><br>

<p class="image"> Midnight Gospel <span>&#8212;</span> Taste of the King
    <img src="{process.env.NODE_ENV === 'development' ? '/efap/' : '/wikoSB/efap/'}MG.png" alt="midnight-gospel" class="image" />
</p>
<br><br>

<p class="image"> Popeye the Sailor
    <img src="{process.env.NODE_ENV === 'development' ? '/efap/' : '/wikoSB/efap/'}popeye_rgb_8bit.png" alt="popeye" class="image" />
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

.image {
    text-align: center;
    font-style: italic;
    width: 50vw;
}

</style>


