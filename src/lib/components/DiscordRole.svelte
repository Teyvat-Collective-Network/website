<script lang="ts">
    import Icon from "./Icon.svelte";

    export let id: string;
    export let name: string | undefined;
    export let color: number;
    export let icon: string = "";
</script>

<span
    id="main"
    class="round inline-row gap-1"
    style="outline: 1px solid {name === undefined ? 'rgb(var(--red-text))' : color > 0 ? `#${color.toString(16).padStart(6, '0')}` : 'rgb(var(--bg-1))'}"
>
    {#if icon}<Icon {icon} />{/if}
    {#if name === undefined}
        INVALID: <span><code>{id}</code></span>
    {:else}
        {name}
    {/if}
</span>

<style lang="scss">
    span#main {
        padding: 0 5px;
    }
</style>
