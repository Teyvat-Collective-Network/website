<script lang="ts">
    import Icon from "./Icon.svelte";

    export let e: string;
    export let id: string;
</script>

<svelte:element this={e} {id} class="row gap-1">
    <a href="#{id}"><Icon icon="link" /></a>
    <span><slot /></span>
</svelte:element>
