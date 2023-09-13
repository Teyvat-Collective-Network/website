<script lang="ts">
    import Icon from "./Icon.svelte";
    import Link from "./Link.svelte";

    export let e: string;
    export let id: string;
</script>

<svelte:element this={e} {id} class="row gap-1">
    <Link to="#{id}"><Icon icon="link" /></Link>
    <span><slot /></span>
</svelte:element>
