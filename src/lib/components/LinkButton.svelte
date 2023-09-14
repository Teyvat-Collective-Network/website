<script lang="ts">
    export let to: string;
    export let external: boolean = false;

    let other_classes = "";
    export { other_classes as classes };
</script>

<a on:click {...$$props} class={other_classes} href={to} {...external ? { target: "_blank", rel: "noreferrer" } : {}}><slot /></a>

<style lang="scss">
    a {
        background-color: rgb(var(--accent-button));
        border-radius: 5px;
        color: rgb(var(--text-1));
        font-weight: 400;
        padding: 0.5em 1.5em;
        text-decoration: none;
    }
</style>
