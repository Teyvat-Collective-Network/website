<script lang="ts">
    export let value: string;
    const _ = value;

    let other_classes = "";

    export { other_classes as class };

    let item: any;

    function update() {
        value = item.innerHTML.replaceAll("<div>", "\n").replaceAll("<br>", "").replaceAll("</div>", "").replaceAll("&nbsp;", " ");
    }
</script>

<svelte:window on:keydown={update} on:keyup={update} on:mousedown={update} />

<div bind:this={item} {...$$props} class={other_classes} contenteditable>{_}</div>

<style lang="scss">
    div {
        background-color: rgb(var(--bg-3));
        border-radius: 5px;
        border: none;
        font-family: "Share Tech Mono", monospace;
        line-height: 120%;
        outline: none;
        padding: 5px;
    }
</style>
