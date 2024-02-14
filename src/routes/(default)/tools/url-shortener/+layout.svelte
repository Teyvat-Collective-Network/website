<script lang="ts">
    import { page } from "$app/stores";
    import Callout from "$lib/components/Callout.svelte";
    import Login from "$lib/components/Login.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect={$page.url.pathname} />
{:else if !$user.council}
    <div class="container">
        <Callout style="red">
            <p>This feature is only available to council members.</p>
        </Callout>
    </div>
{:else}
    <slot />
{/if}
