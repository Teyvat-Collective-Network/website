<script lang="ts">
    import { onMount } from "svelte";

    export let id: string;

    let show = false;
    onMount(() => (show = true));

    export function dismiss() {
        show = false;
        document.cookie = `dismiss-${id}=true; expires=${new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
    }
</script>

{#if show && !document.cookie.includes(`dismiss-${id}=true`)}
    <slot />
{/if}
