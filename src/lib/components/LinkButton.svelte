<script lang="ts">
    import Link from "./Link.svelte";

    export let to: string;
    export let external: boolean = false;

    let other_classes = "";
    export { other_classes as classes };
</script>

<Link {...$$props} {to} {external} class="link-button {other_classes}"><slot /></Link>

<style lang="scss">
    :global(.link-button) {
        background-color: rgb(var(--accent-button));
        border-radius: 5px;
        color: rgb(var(--text-1));
        font-weight: 400;
        padding: 0.5em 1.5em;
    }
</style>
