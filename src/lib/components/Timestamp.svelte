<svelte:options customElement="time-stamp" />

<script lang="ts">
    export let timestamp: number | string;
    export let short = false;
    export let ms = false;

    $: ts = typeof timestamp === "number" ? timestamp : parseInt(timestamp);
    $: real = ms ? ts : ts * 1000;
    $: isostring = new Date(real - new Date().getTimezoneOffset() * 60000).toISOString();
</script>

{(short ? isostring.split("T")[1] : isostring.replace("T", " | ")).slice(0, -5)}
