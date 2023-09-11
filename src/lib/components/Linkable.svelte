<script lang="ts">
    import Icon from "./Icon.svelte";

    export let e: string;
    export let id: string;
</script>

<svelte:element this={e} {id} class="item">
    <a href="#{id}"><Icon icon="link" /></a>
    <span><slot /></span>
</svelte:element>

<style lang="scss">
    .item {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 0.5em;
    }
</style>
