<script lang="ts">
    import Icon from "./Icon.svelte";

    export let icon: string = "";
    export let color: string = "rgb(var(--accent), 50%)";

    let other_classes: string = "";
    export { other_classes as class };
</script>

<div {...$$props} id="badge" class="row gap-1 round {other_classes}" style="background-color: {color}">
    {#if icon}<Icon {icon} />{/if}
    <slot />
</div>

<style lang="scss">
    #badge {
        cursor: default;
        padding: 0 6px;
    }
</style>
