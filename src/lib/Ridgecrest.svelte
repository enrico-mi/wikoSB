<script>
const url = "/Ridgecrest/index.html";


import { onMount } from 'svelte';
let iframeHeight = 0;
const updateIframeHeight = () => {
    const iframe = document.getElementById('my-iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const contentHeight = iframeDoc.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    iframeHeight = Math.max(contentHeight, windowHeight);
    iframe.style.height = `${iframeHeight}px`;
}
onMount(() => {
    updateIframeHeight();
    window.addEventListener('resize', updateIframeHeight);
});
</script>

<!-- <iframe id="my-iframe" src="{url}" style="width: 100%" frameborder="0"></iframe> -->
<iframe id="my-iframe" src="{process.env.NODE_ENV === 'development' ? '/Ridgecrest/index.html' : '/wikoSB/Ridgecrest/index.html'}" style="width: 100%" frameborder="0"></iframe>
