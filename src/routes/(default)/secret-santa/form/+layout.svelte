<script lang="ts">
    import Login from "$lib/components/Login.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect="/secret-santa/form" />
{:else}
    <slot />
{/if}
