<script lang="ts">
    import { user } from "$lib/stores";
    import type { Poll, PollVote } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import A from "../A.svelte";
    import Icon from "../Icon.svelte";
    import Modal from "../Modal.svelte";
    import UserMention from "../UserMention.svelte";

    export let poll: Poll;
    export let vote: PollVote | null;

    $: candidates = (!vote?.abstain && vote?.candidates) || Object.fromEntries(poll.mode === "election" ? poll.candidates.map((x) => [x, 0]) : []);

    $: ranked = Object.entries(candidates)
        .filter(([, y]) => y > 0)
        .sort(([, x], [, y]) => x - y)
        .map(([x]) => x);
    $: counter = Object.keys(candidates).filter((x) => candidates[x] === -1);
    $: abstain = Object.keys(candidates).filter((x) => candidates[x] === 0);

    const dispatch = createEventDispatcher();

    let open = false;

    function remapFn(fn: (rank: number) => number) {
        candidates = Object.fromEntries(Object.entries(candidates).map(([x, y]) => [x, fn(y)]));
    }

    function remap(transformations: [number, number][]) {
        const map = Object.fromEntries(transformations);
        remapFn((x) => map[x] ?? x);
    }
</script>

<Modal button bind:open>
    <h3 class="short">Election Ballot</h3>
    <span slot="button" class="row"><Icon icon="edit" /></span>
    <div id="grid">
        {#each [ranked, counter, abstain] as array, index}
            <b class="full" style="padding-top: 10px">{["Ranked", "Voted Against", "Abstained For"][index]}:</b>
            {#each array as id, rank}
                {#if id !== $user?.id}
                    <span class="first"><code>{@html index === 0 ? rank + 1 : "&mdash;"}</code></span>
                    <span><UserMention {id} /></span>
                    {#if index !== 0}
                        <span />
                        <span />
                        <A class="inline-row green-text" on:click={() => (candidates[id] = ranked.length + 1)}>
                            <Icon icon="keyboard_double_arrow_up" /> Rank
                        </A>
                    {:else}
                        {#if rank !== 0}
                            <A
                                class="inline-row"
                                on:click={() =>
                                    remap([
                                        [rank, rank + 1],
                                        [rank + 1, rank],
                                    ])}
                            >
                                <Icon icon="keyboard_arrow_up" />
                            </A>
                        {:else}
                            <span />
                        {/if}
                        {#if rank !== ranked.length - 1}
                            <A
                                class="inline-row"
                                on:click={() =>
                                    remap([
                                        [rank + 1, rank + 2],
                                        [rank + 2, rank + 1],
                                    ])}
                            >
                                <Icon icon="keyboard_arrow_down" />
                            </A>
                        {:else}
                            <span />
                        {/if}
                        <span />
                    {/if}
                    {#each [0, 1] as key}
                        {#if index !== key + 1}
                            <A
                                class="inline-row gap-1 {['red-text', 'text-2'][key]}"
                                on:click={() =>
                                    candidates[id] > 0 ? remapFn((x) => (x === rank ? key - 1 : x > rank ? x - 1 : x)) : (candidates[id] = key - 1)}
                            >
                                <Icon icon={["keyboard_double_arrow_down", "remove"][key]} />
                                {["Counter-vote", "Abstain"][key]}
                            </A>
                        {:else}
                            <span />
                        {/if}
                    {/each}
                    <span class="last" />
                {/if}
            {/each}
            {#if array.length === 0}
                <span class="first"><code>&mdash;</code></span>
                <span class="text-2">(none)</span>
            {/if}
        {/each}
    </div>
    {#if ($user?.id ?? 0) in candidates}
        <p class="text-2">You're a candidate in this election, but your vote will automatically be recorded as abstaining for yourself.</p>
    {:else}
        <br />
    {/if}
    <button on:click={() => (dispatch("submit", candidates), (open = false))}><Icon icon="save" /></button>
</Modal>

<style lang="scss">
    #grid {
        align-items: center;
        display: grid;
        gap: 5px 20px;
        grid-template-columns: repeat(6, auto) 1fr;
    }

    .full {
        grid-column: 1 / 8;
    }

    .first {
        grid-column: 1;
    }

    .last {
        grid-column: 7;
    }

    .remainder {
        grid-column: 3 / 8;
    }
</style>
