<script lang="ts">
    import { page } from "$app/stores";
    import Callout from "$lib/components/Callout.svelte";
    import Login from "$lib/components/Login.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect={$page.url.pathname} />
{:else if $user.observer}
    <div class="container">
        <slot />
    </div>
{:else}
    <div class="container">
        <h1>Admin Page</h1>
        <Callout style="red">
            <p>This page is only available to observers.</p>
        </Callout>
    </div>
{/if}
