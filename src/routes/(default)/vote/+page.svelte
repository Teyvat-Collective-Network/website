<script lang="ts" context="module">
    const inductKeys = ["induct", "preinduct", "reject", "extend"] as const;
</script>

<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Show from "$lib/components/Show.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import ElectionModal from "$lib/components/vote/ElectionModal.svelte";
    import SelectionModal from "$lib/components/vote/SelectionModal.svelte";
    import { token, user } from "$lib/stores";
    import type { Poll, PollResults, PollVote } from "$lib/types";
    import { onMount } from "svelte";

    let polls: Poll[];
    let failed: boolean, done: boolean;

    const results: Record<number, PollResults> = {};
    const votes: Record<number, PollVote | null> = {};

    onMount(async () => {
        try {
            polls = await api($token, `GET /polls`).catch(alert);
        } catch {
            failed = true;
        }

        done = true;

        setTimeout(() => {
            const observer = new IntersectionObserver(async (entries) => {
                for (const entry of entries)
                    if (entry.isIntersecting) {
                        const id = +(entry.target as any).dataset.id;
                        if (results[id]) return;

                        results[id] = await api($token, `GET /polls/${id}/results`);

                        const poll = polls.find((x) => x.id === id)!;
                        if (!poll.restricted || $user!.voter)
                            try {
                                votes[id] = await api($token, `GET /polls/${id}/vote`);
                            } catch {
                                votes[id] = null;
                                open[id] = !poll.closed;
                            }
                    }
            });

            for (const node of document.querySelectorAll(".observe")) observer.observe(node);
        });
    });

    async function submitVote(id: number, vote: Partial<PollVote>) {
        vote.abstain ??= false;
        await api($token, `PUT /polls/${id}/vote`, vote).catch(alert);
        results[id] = await api($token, `GET /polls/${id}/results`).catch(alert);
        votes[id] = await api($token, `GET /polls/${id}/vote`).catch(alert);
    }

    const open: Record<number, boolean> = {};
</script>

<h1>Voting Center</h1>
{#if $user?.observer}
    <LinkButton to="/vote/edit/new">Create Vote</LinkButton>
    <LinkButton to="/vote/records">Vote Records</LinkButton>
{/if}
<br /><br />
<Loading {done}>
    {#if failed}
        <Callout style="red">
            <p>Failed to load polls.</p>
        </Callout>
    {:else}
        {#each [0, 1, 2] as index}
            {@const filtered =
                index === 0
                    ? polls.filter((x) => !x.closed && (!x.restricted || $user?.voter))
                    : index === 1
                    ? polls.filter((x) => !x.closed && x.restricted && !$user?.voter)
                    : polls.filter((x) => x.closed)}
            {#if filtered.length > 0}
                <h3 class="short">{["Polls For You", "Ongoing Polls You Cannot Vote On", "Past Polls"][index]}</h3>
                {#each filtered as poll}
                    <div class="panel observe {index === 0 && votes[poll.id] === null ? 'waiting' : ''}" data-id={poll.id}>
                        <h4 class="short row gap-1">
                            <A class="row" on:click={() => (open[poll.id] = !open[poll.id])}>
                                <Icon icon={open[poll.id] ? "keyboard_arrow_down" : "chevron_right"} />
                            </A>
                            {#if $user?.observer}<A class="row" to="/vote/edit/{poll.id}"><Icon icon="edit" /></A>{/if}
                            {poll.mode === "proposal" || poll.mode === "selection"
                                ? poll.question
                                : poll.mode === "induction"
                                ? `Induct ${poll.server}?`
                                : poll.mode === "election"
                                ? `Please vote in the Wave ${poll.wave} Election.`
                                : "?"}
                        </h4>
                        <p class="text-2">
                            {results[poll.id] ? `${results[poll.id].turnout.toFixed(2)}% Turnout Reached` : "Loading Voter Turnout..."}
                            &mdash; Deadline: <Mention type="time"><Timestamp ms timestamp={poll.close} /></Mention>
                            &mdash; Quorum: {poll.quorum}%
                        </p>
                        <Show when={open[poll.id]}>
                            {#if poll.mode === "election"}
                                <b>Candidates (arbitrary order):</b>
                                <ul class="space">
                                    {#each poll.candidates as id}
                                        <li><UserMention {id} /></li>
                                    {/each}
                                </ul>
                            {:else if poll.mode === "selection"}
                                <b>Options</b>
                                <ul class="space">
                                    {#each poll.options as option, index}
                                        <li><code>{"ABCDEFGHIJ"[index]}</code> &mdash; {option}</li>
                                    {/each}
                                </ul>
                            {/if}
                            {#if results[poll.id]}
                                <hr />
                                {#if poll.live || (poll.closed && results[poll.id].turnout > poll.quorum)}
                                    {@const result = results[poll.id]}
                                    {#if poll.mode === "proposal"}
                                        <div
                                            style="display: grid; grid-template-columns: auto {result.votes > 0
                                                ? (result.yes / result.votes).toFixed(4)
                                                : 1}fr {result.votes > 0 ? (result.no / result.votes).toFixed(4) : 0}fr auto; align-items: center"
                                        >
                                            <div class="row" style="padding-right: 10px">
                                                <Icon icon="check" class="green-text" style="font-size: 200%" />
                                            </div>
                                            <div
                                                style="opacity: 75%; background-color: rgb(var({result.votes > 0
                                                    ? '--green-text'
                                                    : '--invert-rgb'})); border-radius: 5px {`${result.no > 0 ? 0 : 5}px `.repeat(2)} 5px"
                                            >
                                                &ZeroWidthSpace;
                                            </div>
                                            <div
                                                style="opacity: 75%; background-color: rgb(var(--red-text)); border-radius: {result.yes > 0
                                                    ? 0
                                                    : 5}px 5px 5px {result.yes > 0 ? 0 : 5}px"
                                            >
                                                &ZeroWidthSpace;
                                            </div>
                                            <div class="row" style="padding-left: 10px">
                                                <Icon icon="clear" class="red-text" style="font-size: 200%" />
                                            </div>
                                        </div>
                                        <p>
                                            {((ratio) =>
                                                ratio > 0.4 && ratio < 0.6
                                                    ? "This vote has resulted in a tie."
                                                    : ratio > 0.5
                                                    ? "The motion has passed."
                                                    : "The motion has been rejected.")(result.votes > 0 ? result.yes / result.votes : 0.5)}
                                        </p>
                                    {:else if poll.mode === "induction"}
                                        <div
                                            style="display: grid; grid-template-columns: auto auto {'1fr '.repeat(
                                                Math.max(result.induct, result.preinduct, result.reject, result.extend) || 1,
                                            )}; gap: 10px 0"
                                        >
                                            {#each inductKeys.filter((x) => (poll.mode === "induction" && poll.preinduct) || x !== "preinduct") as key}
                                                <b style="padding-right: 10px; grid-column: 1">
                                                    {key === "induct"
                                                        ? "Induct"
                                                        : key === "preinduct"
                                                        ? "Induct Later"
                                                        : key == "reject"
                                                        ? "Reject"
                                                        : key === "extend"
                                                        ? "Extend Observation"
                                                        : "?"}
                                                </b>
                                                <span><code style="margin-right: 10px">{result[key]}</code></span>
                                                <div
                                                    class="round"
                                                    style="opacity: {result[key] > 0 ? 75 : 0}%; background-color: rgb(var({key === 'induct'
                                                        ? '--green-text'
                                                        : key === 'preinduct'
                                                        ? '--yellow-text'
                                                        : key === 'reject'
                                                        ? '--red-text'
                                                        : key === 'extend'
                                                        ? '--blue-text'
                                                        : '--invert-rgb'})); grid-column: auto / span {result[key] || 1}"
                                                >
                                                    &ZeroWidthSpace;
                                                </div>
                                            {/each}
                                        </div>
                                        <p>
                                            {((ratio) =>
                                                ratio > 0.4 && ratio < 0.6
                                                    ? "Approval and disapproval are tied. A full re-vote is required."
                                                    : ratio > 0.5
                                                    ? ((sub) =>
                                                          sub > 0.4 && sub < 0.6
                                                              ? `${poll.server} was approved but a re-vote is required to determine if they are inducted now or at a later date.`
                                                              : sub > 0.5
                                                              ? `${poll.server} was approved for induction!`
                                                              : `${poll.server} was pre-approved to be inducted at a later date.`)(
                                                          result.induct / (result.induct + result.preinduct),
                                                      )
                                                    : ((sub) =>
                                                          sub > 0.4 && sub < 0.6
                                                              ? `${poll.server} was rejected but a re-vote is required to determine if they will be rejected or re-observed.`
                                                              : sub > 0.5
                                                              ? `${poll.server} was rejected.`
                                                              : `The verdict is to re-observe ${poll.server}. A different observer will carry out another 28 days of observation.`)(
                                                          result.reject / (result.reject + result.extend),
                                                      ))(result.votes > 0 ? (result.induct + result.preinduct) / result.votes : 0.5)}
                                        </p>
                                    {:else if poll.mode === "election"}
                                        <p>
                                            <b>Winners:</b>
                                            {#each result.winners as id}
                                                <UserMention {id} />
                                            {/each}
                                        </p>
                                        <p>
                                            {#if result.tied.length > 0}
                                                The following users are tied for the remaining {poll.seats - result.winners.length} seat{poll.seats ===
                                                result.winners.length + 1
                                                    ? ""
                                                    : "s"}:
                                                {#each result.tied as id}
                                                    <UserMention {id} />
                                                {/each}
                                            {/if}
                                        </p>
                                    {:else if poll.mode === "selection"}
                                        <div class="selection-results">
                                            {#each poll.options as option, index}
                                                <span><code>{"ABCDEFGHIJ"[index]}</code></span>
                                                <div
                                                    style="display: grid; grid-template-columns: {result.scores[option]}fr {(result.votes || 1) -
                                                        result.scores[option]}fr"
                                                >
                                                    <div
                                                        style="opacity: 75%; background-color: rgb(var(--green-text)); border-radius: 5px {`${
                                                            result.scores[option] === result.votes ? 5 : 0
                                                        }px `.repeat(2)} 5px"
                                                    />
                                                    <div
                                                        class="bg-1"
                                                        style="border-radius: {result.scores[option] === 0 ? 5 : 0}px 5px 5px {result.scores[option] === 0
                                                            ? 5
                                                            : 0}px"
                                                    />
                                                </div>
                                                <span><code>{((result.scores[option] * 100) / (result.votes || 1)).toFixed(2)}%</code></span>
                                            {/each}
                                        </div>
                                    {/if}
                                    <p class="text-2">{result.abstains} voter{result.abstains === 1 ? "" : "s"} abstained.</p>
                                {:else if poll.closed}
                                    <p class="text-2">This poll did not reach quorum. An observer needs to restart it.</p>
                                {:else}
                                    <p class="text-2">The results of this poll are hidden until the poll concludes.</p>
                                {/if}
                            {:else}
                                <Loading />
                            {/if}
                            {#if !poll.restricted || $user?.voter}
                                {#if votes[poll.id] !== undefined}
                                    {@const vote = votes[poll.id]}
                                    <hr />
                                    {#if !vote}
                                        <p>{poll.closed ? "You did not vote on this poll." : "You have not voted on this poll yet."}</p>
                                    {:else if vote.abstain}
                                        <p>You abstained on this poll.</p>
                                    {:else if poll.mode === "proposal"}
                                        <p>You voted {vote.yes ? "in favor of" : "against"} the motion.</p>
                                    {:else if poll.mode === "induction"}
                                        <p>
                                            You have voted to {vote.verdict === "preinduct" ? "induct" : vote.verdict}
                                            {poll.server}{vote.verdict === "preinduct"
                                                ? " at a later date"
                                                : vote.verdict === "extend"
                                                ? "'s observation"
                                                : ""}.
                                        </p>
                                    {:else if poll.mode === "election"}
                                        {@const ranked = Object.entries(vote.candidates)
                                            .filter(([, y]) => y > 0)
                                            .sort(([, x], [, y]) => x - y)
                                            .map(([x]) => x)}
                                        {@const counter = Object.keys(vote.candidates).filter((x) => vote.candidates[x] === -1)}
                                        {@const abstain = Object.keys(vote.candidates).filter((x) => vote.candidates[x] === 0)}
                                        {#if ranked.length > 0}
                                            <b>Ranked:</b>
                                            <ol class="space">
                                                {#each ranked as id}
                                                    <li><UserMention {id} /></li>
                                                {/each}
                                            </ol>
                                        {/if}
                                        {#if counter.length > 0}
                                            <p>
                                                <b>Voted against:</b>
                                                {#each counter as id}
                                                    <UserMention {id} />
                                                {/each}
                                            </p>
                                        {/if}
                                        {#if abstain.length > 0}
                                            <p>
                                                <b>Abstained for:</b>
                                                {#each abstain as id}
                                                    <UserMention {id} />
                                                {/each}
                                            </p>
                                        {/if}
                                    {:else if poll.mode === "selection"}
                                        <b>You voted for:</b>
                                        <ul>
                                            {#each vote.selected as option}
                                                <li>{option}</li>
                                            {/each}
                                            {#if vote.selected.length === 0}
                                                <li class="text-2">(none)</li>
                                            {/if}
                                        </ul>
                                    {/if}
                                    {#if !poll.closed}
                                        <p>
                                            <button class="row" disabled={vote?.abstain} on:click={() => submitVote(poll.id, { abstain: true })}>
                                                <Icon icon="cancel" /> Abstain
                                            </button>
                                        </p>
                                        {#if poll.mode === "proposal"}
                                            <p class="row gap-1">
                                                <button
                                                    class="green-button"
                                                    disabled={vote && !vote.abstain && vote.yes}
                                                    on:click={() => submitVote(poll.id, { yes: true })}><Icon icon="arrow_upward" /></button
                                                >
                                                <button
                                                    class="red-button"
                                                    disabled={vote && !vote.abstain && !vote.yes}
                                                    on:click={() => submitVote(poll.id, { yes: false })}><Icon icon="arrow_downward" /></button
                                                >
                                            </p>
                                        {:else if poll.mode === "induction"}
                                            <div class="row gap-1">
                                                {#each inductKeys.filter((x) => (poll.mode === "induction" && poll.preinduct) || x !== "preinduct") as key}
                                                    <button
                                                        class="row"
                                                        disabled={vote && !vote.abstain && vote.verdict === key}
                                                        on:click={() => submitVote(poll.id, { verdict: key })}
                                                        style={vote && !vote.abstain && vote.verdict === key
                                                            ? ""
                                                            : `background-color: rgb(var(--${
                                                                  { induct: "green", preinduct: "yellow", reject: "red", extend: "blue" }[key]
                                                              }-callout))`}
                                                    >
                                                        <Icon
                                                            icon={key === "induct"
                                                                ? "check"
                                                                : key === "preinduct"
                                                                ? "schedule"
                                                                : key === "reject"
                                                                ? "clear"
                                                                : key === "extend"
                                                                ? "replay"
                                                                : "?"}
                                                        />
                                                        {key[0].toUpperCase()}{key.slice(1)}
                                                    </button>
                                                {/each}
                                            </div>
                                        {:else if poll.mode === "election"}
                                            <ElectionModal
                                                {poll}
                                                {vote}
                                                on:submit={({ detail }) => submitVote(poll.id, { candidates: { ...detail, [$user?.id ?? ""]: undefined } })}
                                            />
                                        {:else if poll.mode === "selection"}
                                            <SelectionModal {poll} {vote} on:submit={({ detail }) => submitVote(poll.id, { selected: detail })} />
                                        {/if}
                                    {/if}
                                {:else}
                                    <Loading />
                                {/if}
                            {/if}
                        </Show>
                    </div>
                {/each}
                <br />
            {/if}
        {/each}
    {/if}
</Loading>

<style lang="scss">
    .waiting {
        outline: 2px solid rgb(var(--red-text));
    }

    .selection-results {
        display: grid;
        gap: 10px 25px;
        grid-template-columns: auto 1fr auto;
    }
</style>
