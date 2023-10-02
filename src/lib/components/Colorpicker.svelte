<script lang="ts">
    import { Color, ColorPicker } from "svelte-colorpick";
    import Modal from "./Modal.svelte";

    export let color: number;

    let _color = Color.hex(`#${color.toString(16).padStart(6, "0")}`);

    $: color = parseInt(_color.toHex().slice(1), 16);
    $: r = color >> 16;
    $: g = (color >> 8) & 0xff;
    $: b = color & 0xff;
    $: L = 0.299 * r + 0.587 * g + 0.114 * b;

    let open = false;
</script>

<div id="outer">
    <button style="background-color: {_color.toHex()}" on:click={(e) => (open = true)}>
        <b style="color: {L > 100 ? 'black' : 'white'}">{_color.toHex()}</b>
    </button>
    <Modal bind:open background_color="transparent">
        <div class="col">
            <ColorPicker showSliders={{ tabbed: false, "rgb.r": true, "rgb.g": true, "rgb.b": true }} bind:color={_color} />
        </div>
    </Modal>
</div>

<style lang="scss">
    button {
        outline: 1px solid rgb(var(--invert-rgb), 50%);
    }

    #outer {
        position: relative;
    }

    :global(.color-picker-controls) {
        background-color: rgb(var(--bg-1)) !important;
        padding: 1em;
        border-radius: 5px;
    }

    :global(.color-picker-controls .slider) {
        padding-bottom: 10px;
    }

    :global(.color-picker-controls input[type="radio"]) {
        background-color: rgb(var(--bg-4));
        margin-right: 10px !important;
    }
</style>
