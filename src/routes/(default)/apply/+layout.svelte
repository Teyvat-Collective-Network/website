<script lang="ts">
    import A from "$lib/components/A.svelte";
    import { user } from "$lib/stores";
</script>

{#if $user}
    <slot />
{:else}
    <div class="container">
        <div class="panel">
            Please <A to="/login?redirect=/apply">log in</A> to apply.
        </div>
    </div>
{/if}
