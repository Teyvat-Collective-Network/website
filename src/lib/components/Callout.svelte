<svelte:options customElement="call-out" />

<script lang="ts" context="module">
    const styles = {
        green: { icon: "check", color: "rgb(var(--green-callout))" },
        info: { icon: "info", color: "rgb(var(--blue-callout))" },
        warn: { icon: "info", color: "rgb(var(--yellow-callout))" },
        red: { icon: "report", color: "rgb(var(--red-callout))" },
    };
</script>

<script lang="ts">
    import Icon from "./Icon.svelte";

    export let style: keyof typeof styles | null = null;
    export let color: string | null = null;
    export let icon: string | null = null;
</script>

<div id="callout" style="background-color: {color ?? styles[style ?? 'info'].color}">
    <div id="icon"><Icon icon={icon ?? styles[style ?? "info"].icon} /></div>
    <div><slot /></div>
</div>

<style lang="scss">
    #callout {
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        padding: 1em;
    }

    #icon {
        padding: 1.3em 1em 0 0;
    }
</style>
