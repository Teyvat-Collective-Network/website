<script lang="ts" context="module">
    const icons = {
        user: "alternate_email",
        text: "tag",
    };
</script>

<script lang="ts">
    import Icon from "./Icon.svelte";

    export let id: string = "";
    export let type: keyof typeof icons | "none" = "user";

    let other_classes = "";
    export { other_classes as class };

    let clicked = 0;

    function click() {
        if (!id) return;

        navigator.clipboard.writeText(id);

        clicked++;
        setTimeout(() => clicked--, 1500);
    }
</script>

<div role="none" on:click={click}>
    {#if type === "none"}
        <span {...$$restProps} class="mention {clicked ? 'green-callout' : ''} {other_classes}"><slot /></span>
    {:else}
        <span {...$$restProps} class="mention {clicked ? 'green-callout' : ''} with-icon {other_classes}"><Icon icon={icons[type]} /> <slot /></span>
    {/if}
</div>

<style lang="scss">
    div {
        display: inline-block;
    }
</style>
