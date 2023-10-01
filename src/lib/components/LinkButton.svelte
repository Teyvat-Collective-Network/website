<script lang="ts">
    export let to: string;
    export let external: boolean = false;
</script>

<a on:click {...$$restProps} href={to} {...external ? { target: "_blank", rel: "noreferrer" } : {}}><slot /></a>

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
