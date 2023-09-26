<script lang="ts">
    import { onMount } from "svelte";

    export let value: string;
    export let name: string = "";
    const _ = value || "";

    let other_classes = "";

    export { other_classes as class };

    let item: any;

    function update() {
        value = new DOMParser().parseFromString(
            item.innerHTML.replaceAll("<div>", "\n").replaceAll("<br>", "").replaceAll("</div>", "").replaceAll("&nbsp;", " "),
            "text/html",
        ).documentElement.textContent!;
    }

    onMount(() =>
        item.addEventListener("paste", (e: any) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            document.execCommand("insertHTML", false, text);
        }),
    );
</script>

<svelte:window on:keydown={update} on:keyup={update} on:mousedown={update} />

<div bind:this={item} {...$$props} class={other_classes} contenteditable>{_}</div>

{#if name}
    <textarea {name} hidden bind:value />
{/if}

<style lang="scss">
    div {
        background-color: rgb(var(--bg-3));
        border-radius: 5px;
        border: none;
        font-family: "Atkinson Hyperlegible", sans-serif;
        line-height: 120%;
        outline: none;
        padding: 5px;
        word-wrap: break-word;
    }
</style>
