<script>
async function populate() {

    const requestURL = 'https://github.com/MuseumofModernArt/collection/blob/master/Artworks.json';
    const request = new Request(requestURL);

    const response = await fetch(request);
    const momaArtists = await response.json();

    console.log("Number of Artists in the collection: ", Object.keys(momaArtists).length);
}
populate();
</script>

<main>
<p>ok.<p>
</main>
