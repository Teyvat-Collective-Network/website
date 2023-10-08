<script lang="ts">
    import Callout from "$lib/components/Callout.svelte";
    import Login from "$lib/components/Login.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect="/vote" />
{:else if $user.council}
    <div class="container">
        <slot />
    </div>
{:else}
    <div class="container">
        <Callout style="red">
            <p>This page is only available to council members.</p>
        </Callout>
    </div>
{/if}
