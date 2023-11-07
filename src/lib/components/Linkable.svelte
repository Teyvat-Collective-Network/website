<script lang="ts">
    import A from "./A.svelte";
    import Icon from "./Icon.svelte";

    export let e: string;
    export let id: string;
    export let short: boolean = false;
</script>

<svelte:element this={e} {id} class="{short ? 'short' : ''} row gap-1">
    <A to="#{id}"><Icon icon="link" /></A>
    <span {...$$restProps}><slot /></span>
</svelte:element>
