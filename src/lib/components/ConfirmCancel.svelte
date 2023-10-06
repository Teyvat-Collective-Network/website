<script lang="ts">
    export let cancel: boolean;
    export let valid: any;
    export let confirm: () => any;
    export let canceled: (() => any) | null = null;
    export let save: boolean | undefined = false;

    function maybeSave(e: KeyboardEvent) {
        if (save && valid && e.ctrlKey && e.key === "s") {
            e.preventDefault();
            confirm();
        }
    }
</script>

<svelte:window on:keydown={maybeSave} />

<div class="row gap-1">
    <button class="tp red-text" on:click={() => ((cancel = false), canceled?.())}>Cancel</button>
    <button disabled={!valid} on:click={confirm}>Confirm {save !== undefined ? "(Ctrl+S)" : ""}</button>
</div>
