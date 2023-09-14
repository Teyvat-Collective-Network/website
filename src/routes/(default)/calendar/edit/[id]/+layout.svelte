<script>
    import { page } from "$app/stores";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
</script>

{#if $page.data.error}
    <div class="container">
        <Callout style="red"><p>No event was found with ID {$page.params.id}.</p></Callout>
        <p><A to="/calendar" class="row"><Icon icon="chevron_left" /> Return to Calendar</A></p>
    </div>
{:else}
    <slot />
{/if}
