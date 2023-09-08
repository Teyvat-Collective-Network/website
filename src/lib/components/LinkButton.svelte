<script lang="ts">
    export let href: string;

    let other_classes = "";
    export { other_classes as classes };
</script>

<a {...$$props} {href} class="text-1 accent-button {other_classes}"><slot /></a>

<style lang="scss">
    a {
        padding: 0.5em 1em;
        border-radius: 5px;
    }
</style>
