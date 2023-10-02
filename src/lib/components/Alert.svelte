<script lang="ts">
    import Icon from "./Icon.svelte";

    export let icon: string = "";
    export let text: string;
    export let open: boolean;
    export let background: string = "rgb(var(--bg-0))";
    export let color: string = "rgb(var(--text-accent))";

    let first = false;
    $: first ||= open;
</script>

<div id="box" class="col">
    <div id="alert" class="row gap-1 {open ? 'open' : ''}" style="background-color: {background}; color: {color}; opacity: {first ? 1 : 0}">
        <Icon {icon} />
        {text}
    </div>
</div>

<style lang="scss">
    #alert {
        border-radius: 1.2em;
        bottom: -50px;
        height: 2.4em;
        padding: 0 1em;
        position: fixed;
        transform: translateY(0);
        transition: transform 250ms cubic-bezier(0, 1, 0.4, 1.1);

        &.open {
            transform: translateY(-100px);
        }
    }

    #box {
        inset: 0;
        pointer-events: none;
        position: fixed;
        z-index: 20;
    }
</style>
