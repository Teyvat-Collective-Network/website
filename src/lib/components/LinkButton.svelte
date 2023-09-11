<script lang="ts">
    export let to: string;

    let other_classes = "";
    export { other_classes as classes };
</script>

<a {...$$props} href={to} class="text-1 accent-button {other_classes}"><slot /></a>

<style lang="scss">
    a {
        padding: 0.5em 1em;
        border-radius: 5px;
    }
</style>
