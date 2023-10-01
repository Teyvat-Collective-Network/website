<script lang="ts">
    import { getTag } from "$lib/utils";
    import { onMount } from "svelte";

    export let id: string;
    export let tag: string | null = null;

    $: id, (tag = null), id && getTag(id).then((x) => (tag = x));
</script>

{#if tag}
    {tag}
{:else}
    <code>User {id}</code>
{/if}
