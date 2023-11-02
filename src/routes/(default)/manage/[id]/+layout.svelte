<script lang="ts">
    import { page } from "$app/stores";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import { user } from "$lib/stores";
</script>

<div class="container">
    {#if $user?.observer || Object.entries($user?.guilds ?? {}).filter(([, y]) => y.council).length > 1}
        <p><A to="/manage">Back To Server List</A></p>
    {/if}
    {#if $user?.observer || $user?.guilds?.[$page.params.id]?.council}
        <slot />
    {:else}
        <Callout style="red">
            <p>You are not the owner or advisor of this guild nor an observer.</p>
        </Callout>
    {/if}
</div>
