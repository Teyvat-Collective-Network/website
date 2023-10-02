<svelte:options customElement="user-id" />

<script lang="ts">
    import { getTag } from "$lib/utils";

    export let id: string;
    export let tag: string | null = null;

    $: id, (tag = null), id && getTag(id).then((x) => (tag = x));
</script>

{#if tag}
    {tag}
{:else}
    <span><code>User {id}</code></span>
{/if}
