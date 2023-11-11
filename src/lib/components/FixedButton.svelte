<script lang="ts">
    import Icon from "./Icon.svelte";

    export let icon: string;
    export let click: (e: MouseEvent) => any;
    export let always = false;
    export let index = 0;
    export let backgroundColor: string = "rgb(var(--text-accent))";
    export let color: string = "rgb(var(--pure-rgb))";

    let scroll: number;
</script>

<svelte:window bind:scrollY={scroll} />

<button
    on:click={click}
    style="background-color: {backgroundColor}; color: {color}; bottom: {index * 60 + 50}px; opacity: {always || scroll
        ? 1
        : 0}; pointer-events: {always || scroll ? 'inherit' : 'none'}"
>
    <Icon {icon} />
</button>

<style lang="scss">
    button {
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        border: none;
        box-shadow: 2px 2px 10px rgb(var(--pure-rgb), 75%);
        outline: none;
        padding: 10px;
        position: fixed;
        right: 50px;
        transition: transform 50ms, box-shadow 50ms, opacity 200ms;
        z-index: 1;

        &:active {
            box-shadow: 2px 2px 10px transparent;
            transform: translate(2px, 2px);
        }
    }
</style>
