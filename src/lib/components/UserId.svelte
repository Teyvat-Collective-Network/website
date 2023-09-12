<script lang="ts">
    import { getTag } from "$lib/utils";

    export let id: string;
    let tag: string | null;

    $: id && getTag(id).then((x) => (tag = x));
</script>

{#if tag}
    {tag}
{:else}
    <code>User {id}</code>
{/if}
