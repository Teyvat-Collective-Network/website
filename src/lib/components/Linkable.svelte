<script lang="ts">
    import A from "./A.svelte";
    import Icon from "./Icon.svelte";

    export let e: string;
    export let id: string;
</script>

<svelte:element this={e} {id} class="row gap-1">
    <A to="#{id}"><Icon icon="link" /></A>
    <span {...$$props}><slot /></span>
</svelte:element>
