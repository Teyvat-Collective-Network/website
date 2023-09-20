<script lang="ts">
    import Login from "$lib/components/Login.svelte";
    import Redirect from "$lib/components/Redirect.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect="/vote" />
{:else if !$user.observer}
    <Redirect />
{:else}
    <slot />
{/if}
