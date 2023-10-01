<script lang="ts">
    export let src: string;
    export let alt: string;

    export let width: string = "";
    export let height: string = "";

    export let style: string = "";

    export let transparent: boolean = false;

    export let open: boolean = false;

    let other_classes = "";
    export { other_classes as class };
</script>

<svelte:window on:keydown={(e) => e.key === "Escape" && (open = false)} />

<img
    role="none"
    class="base {other_classes}"
    {src}
    {alt}
    {width}
    {height}
    on:click={() => (open = true)}
    on:keydown={() => (open = true)}
    style="max-width: 100%; {style}"
/>

<div role="none" class="lightbox {open ? 'open' : ''}" on:click={() => (open = false)} on:keydown={() => (open = false)}>
    <img {src} {alt} class={transparent ? "transparent" : ""} style="max-width: 75%; max-height: 75%" />
</div>

<style lang="scss">
    .lightbox {
        align-items: center;
        backdrop-filter: blur(1px);
        background-color: rgb(var(--pure-rgb), 80%);
        display: inline-grid;
        inset: 0;
        justify-items: center;
        position: fixed;
        transition: opacity 200ms;
        z-index: 25;

        img {
            transition: transform 200ms;

            &:not(.transparent) {
                background-color: rgb(var(--bg-0));
            }
        }

        &:not(.open) {
            opacity: 0%;
            pointer-events: none;

            img {
                transform: scale(1);
            }
        }

        &.open {
            opacity: 100%;

            img {
                transform: scale(1.2);
            }
        }
    }
</style>
