<svelte:options customElement="tcn-link" />

<script lang="ts">
    export let to: string = "javascript:void(0)";
    export let external: boolean = false;

    let other_classes = "";
    export { other_classes as class };
</script>

<a on:click {...$$restProps} class={other_classes} href={to} {...external ? { target: "_blank", rel: "noreferrer" } : {}}><slot /></a>

<style lang="scss">
    a {
        color: rgb(var(--text-accent));
        text-decoration: none;
    }
</style>
