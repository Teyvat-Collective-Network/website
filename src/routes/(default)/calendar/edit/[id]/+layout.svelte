<script>
    import { page } from "$app/stores";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Link from "$lib/components/Link.svelte";
</script>

{#if $page.data.error}
    <div class="container">
        <Callout style="red"><p>No event was found with ID {$page.params.id}.</p></Callout>
        <p><Link to="/calendar" class="row"><Icon icon="chevron_left" /> Return to Calendar</Link></p>
    </div>
{:else}
    <slot />
{/if}
