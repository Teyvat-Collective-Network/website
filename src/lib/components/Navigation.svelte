<script lang="ts">
    import A from "./A.svelte";
    import Icon from "./Icon.svelte";

    export let last: [string, string] | null = null;
    export let next: [string, string] | null = null;
</script>

{#each [0, 1] as x}
    <nav class="row no-center round accent-less">
        <div>
            {#if last}<A class="text-1 row gap-1" to={last[0]}><Icon icon="chevron_left" /> {last[1]}</A>{/if}
        </div>
        <div>
            {#if next}<A class="text-1 row gap-1" to={next[0]}>{next[1]} <Icon icon="chevron_right" /></A>{/if}
        </div>
    </nav>

    {#if x === 0} <div id="slot"><slot /></div> {/if}
{/each}

<style lang="scss">
    nav {
        justify-content: space-between;
        padding: 0.25em 1em;
    }

    #slot {
        padding-bottom: 3em;
    }
</style>
