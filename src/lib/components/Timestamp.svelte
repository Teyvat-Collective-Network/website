<svelte:options customElement="time-stamp" />

<script lang="ts">
    export let timestamp: number | string;
    export let short = false;

    $: ts = typeof timestamp === "number" ? timestamp : parseInt(timestamp);
    $: isostring = new Date(ts * 1000 - new Date().getTimezoneOffset() * 60000).toISOString();
</script>

{@html (short ? isostring.split("T")[1] : isostring.replace("T", "&nbsp;&nbsp;")).slice(0, -5)}
