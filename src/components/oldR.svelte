<script>
const url = "/Ridgecrest/viz_errW_old.html";

import { onMount } from 'svelte';
let iframeHeight = 0;
const updateIframeHeight = () => {
    const iframe = document.getElementById('my-iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeHeight = iframeDoc.documentElement.scrollHeight;
    iframe.style.height = `${iframeHeight}px`;
}
onMount(() => {
    updateIframeHeight();
    window.addEventListener('resize', updateIframeHeight);
});

</script>

<iframe src="{url}" width="100%" frameborder="0"></iframe>
