<script lang="ts">
    import Callout from "$lib/components/Callout.svelte";
    import { user } from "$lib/stores";
</script>

{#if $user?.observer}
    <slot />
{:else}
    <Callout style="red">
        <p>This page is only availale to observer.</p>
    </Callout>
{/if}
