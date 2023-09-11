<script lang="ts">
    import Redirect from "$lib/components/Redirect.svelte";
    import { user } from "$lib/stores";
</script>

{#if $user?.observer}
    <slot />
{:else}
    <Redirect />
{/if}
