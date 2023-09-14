<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let open: any = false;
    export let button = false;
    export let background_color: string = "rgb(var(--bg-3))";
    export let overlay_color: string = "rgb(var(--pure-rgb), 60%)";

    const dispatch = createEventDispatcher();

    function close() {
        open = false;
        dispatch("close");
    }
</script>

<svelte:window on:keydown={(e) => e.key === "Escape" && close()} />

<div id="modal" class={open ? "" : "closed"} style="background-color: {background_color}">
    <div id="content" class="container">
        <slot />
    </div>
</div>

{#if button}
    <button on:click={() => (open = true)}>
        <slot name="button" />
    </button>
{/if}

<div role="none" class="overlay {open ? '' : 'closed'}" style="background-color: {overlay_color}" on:click={close} />

<style lang="scss">
    #content {
        min-width: fit-content;
    }

    #modal {
        border-radius: 5px;
        left: 20%;
        max-height: 50%;
        overflow: scroll;
        padding: 2% 0;
        position: fixed;
        right: 20%;
        top: 20%;
        transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
        z-index: 300;

        &.closed {
            opacity: 0;
            pointer-events: none;
            transform: scale(75%) translateY(-20%);
        }
    }

    @media screen and (max-width: 1000px) {
        #modal {
            left: 5%;
            right: 5%;
        }
    }

    .overlay {
        backdrop-filter: blur(1px);
        inset: 0;
        position: fixed;
        transition: 200ms ease-in-out;
        z-index: 200;

        &.closed {
            opacity: 0;
            pointer-events: none;
        }
    }
</style>
