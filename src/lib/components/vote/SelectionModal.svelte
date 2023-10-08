<script lang="ts">
    import type { Poll, PollVote } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import Icon from "../Icon.svelte";
    import Modal from "../Modal.svelte";
    import Switch from "../Switch.svelte";

    export let poll: Poll;
    export let vote: PollVote | null;

    const { min, max, options } = poll as Poll & { mode: "selection" };

    $: selected = (!vote?.abstain && vote?.selected) || [];

    const dispatch = createEventDispatcher();

    let open = false;
</script>

<Modal button bind:open>
    <h3 class="short">Selection Ballot</h3>
    <h5 class="short text-2">
        Select {min}
        {#if min !== max} &ndash; {max}{/if} option{max === 1 ? "" : "s"}
    </h5>
    <span slot="button" class="row"><Icon icon="edit" /></span>
    <div id="grid">
        {#each options as option}
            <Switch
                on={selected.includes(option)}
                on:toggle={({ detail: x }) => (selected = x ? [...selected, option] : selected.filter((x) => x !== option))}
            />
            <span>{option}</span>
        {/each}
    </div>
    <br />
    <button on:click={() => (dispatch("submit", selected), (open = false))} disabled={selected.length < min || selected.length > max}>
        <Icon icon="save" />
    </button>
</Modal>

<style lang="scss">
    #grid {
        display: grid;
        gap: 10px 25px;
        grid-template-columns: auto 1fr;
    }
</style>
