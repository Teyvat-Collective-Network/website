<script lang="ts">
    import Icon from "./Icon.svelte";

    export let e: string;
    export let icon: string = "";
    export let text: string;
    export let icon_color: string = "inherit";
</script>

<svelte:element this={e} class="item">
    <Icon {icon} style="color: {icon_color}" />
    {text}
</svelte:element>

<style lang="scss">
    .item {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
</style>
