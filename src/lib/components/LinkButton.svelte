<script lang="ts">
    export let to: string;
    export let external: boolean = false;

    let other_classes = "";
    export { other_classes as classes };
</script>

<a {...$$props} href={to} {...external ? { target: "_blank", rel: "noreferrer" } : {}} class="text-1 accent-button {other_classes}"><slot /></a>

<style lang="scss">
    a {
        border-radius: 5px;
        font-weight: 400;
        padding: 0.5em 1.5em;
    }
</style>
