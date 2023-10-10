<svelte:options customElement="user-id" />

<script lang="ts">
    import { tags } from "$lib/stores";
    import { getTag } from "$lib/utils";

    export let id: string;
    export let tag: string | null = null;

    $: id,
        (tag = null),
        id &&
            (id === "1".repeat(18)
                ? (tag = "System")
                : id in $tags
                ? (tag = $tags[id])
                : getTag(id)
                      .then((x) => tags.update((o) => ({ ...o, [id]: (tag = x) })))
                      .catch(() => tags.update((o) => ({ ...o, [id]: (tag = null) }))));
</script>

{#if tag}
    {tag}
{:else}
    <span><code>User {id}</code></span>
{/if}
