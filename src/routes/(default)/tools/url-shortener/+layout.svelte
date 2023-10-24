<script lang="ts">
    import { page } from "$app/stores";
    import Login from "$lib/components/Login.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect={$page.url.pathname} />
{:else}
    <slot />
{/if}
