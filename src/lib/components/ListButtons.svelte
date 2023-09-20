<script lang="ts">
    import ListButton from "./ListButton.svelte";

    export let array: any[];
    export let index: number;
    export let delete_last: boolean = false;
    export let table: boolean = false;
</script>

{#if !delete_last}
    {#if table}
        <td>
            <ListButton bind:array bind:index del />
        </td>
    {:else}
        <ListButton bind:array bind:index del />
    {/if}
{/if}

{#if table}
    <td>
        <ListButton bind:array bind:index up />
    </td>
{:else}
    <ListButton bind:array bind:index up />
{/if}

{#if table}
    <td>
        <ListButton bind:array bind:index down />
    </td>
{:else}
    <ListButton bind:array bind:index down />
{/if}

{#if delete_last}
    {#if table}
        <td>
            <ListButton bind:array bind:index del />
        </td>
    {:else}
        <ListButton bind:array bind:index del />
    {/if}
{/if}
