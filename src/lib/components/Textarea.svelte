<script lang="ts">
    import { onMount } from "svelte";

    export let value: string;
    let item: any;
    let scroll: number;

    function update() {
        const old = scroll;

        item.style.height = 0;
        item.style.height = Math.max(item.scrollHeight, 40) + "px";

        window.scrollTo({ top: old, behavior: "instant" });
    }

    onMount(() => setTimeout(update, 0));
</script>

<svelte:window bind:scrollY={scroll} />

<textarea bind:this={item} {...$$restProps} bind:value on:input={update} />

<style lang="scss">
    textarea {
        resize: none;
    }
</style>
