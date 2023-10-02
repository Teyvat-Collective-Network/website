<script lang="ts">
    import Callout from "$lib/components/Callout.svelte";
    import Login from "$lib/components/Login.svelte";
    import { user } from "$lib/stores";
</script>

<div class="container">
    {#if !$user}
        <Login redirect="/docs" />
    {:else if !$user.council}
        <Callout style="red">
            <p>This feature is only available to TCN council members.</p>
        </Callout>
    {:else}
        <slot />
    {/if}
</div>
