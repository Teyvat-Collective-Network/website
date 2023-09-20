<script lang="ts">
    import { swap, without } from "$lib/utils";
    import Icon from "./Icon.svelte";

    export let array: any[];
    export let index: number;
    export let del: boolean = false;
    export let up: boolean | null = null;
    export let down: boolean | null = null;

    up ??= !down;
    down ??= !up;
</script>

{#if del || index != (up ? 0 : array.length - 1)}
    <button
        class="tp row {del ? 'red-text' : 'text-accent'}"
        on:click={() => (array = del ? without(array, index) : swap(array, index, index + (up ? -1 : 1)))}
    >
        <Icon icon={del ? "delete" : up ? "expand_less" : "expand_more"} />
    </button>
{/if}
