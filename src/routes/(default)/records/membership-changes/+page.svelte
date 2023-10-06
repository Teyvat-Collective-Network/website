<script lang="ts">
    import api from "$lib/api";
    import HistRow from "$lib/components/HistRow.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { alerts, token } from "$lib/stores";
    import type { AuditLogEntry, Guild } from "$lib/types";
    import { onMount } from "svelte";

    let entries: AuditLogEntry[] = [];
    let guilds = new Set<string>();

    const limit = 100;
    let done = false;
    let loading = true;

    onMount(async () => {
        const incoming = await api($token, `GET /audit-logs?limit=${limit}&membership=true`).catch(alert);
        guilds = new Set((await api($token, `GET /guilds`)).map((guild: Guild) => guild.id));

        if (incoming) {
            entries = [...entries, ...incoming];
            loading = false;
        }
    });

    async function loadMore() {
        loading = true;
        const incoming = await api($token, `GET /audit-logs?before=${entries.at(-1)?.time ?? Date.now()}&limit=${limit}&membership=true`).catch(alert);

        if (incoming) {
            if (incoming.length === 0) {
                done = true;
                alerts.nomore.update((x) => x + 1);
                setTimeout(() => alerts.nomore.update((x) => x - 1), 1500);
            } else entries = [...entries, ...incoming];

            loading = false;
        }
    }
</script>

<h1>Membership Changes</h1>
<div class="w-100 hscroll">
    <table id="membership-changes" class="w-100">
        {#each entries as entry}
            {#if entry.action === "guilds/create" || entry.action == "guilds/delete"}
                <HistRow label={entry.action === "guilds/create" ? "Induct" : "Left"} {entry} {guilds}>
                    <td>Owner</td>
                    <td><UserMention id={entry.data.owner} /></td>
                    <td>Advisor</td>
                    <td>
                        {#if entry.data.advisor}<UserMention id={entry.data.advisor} />{:else}<span class="text-2">(none)</span>{/if}
                    </td>
                </HistRow>
            {:else if entry.action === "guilds/edit"}
                {@const changes = entry.data.changes}
                {#if changes.owner && changes.advisor && changes.owner[0] === changes.advisor[1] && changes.owner[1] === changes.advisor[0]}
                    <HistRow label="Switch Owner and Advisor" {entry} {guilds}>
                        <td>Owner &rightarrow; Advisor</td>
                        <td><UserMention id={changes.owner[0]} /></td>
                        <td>Advisor &rightarrow; Owner</td>
                        <td><UserMention id={changes.owner[1]} /></td>
                    </HistRow>
                {:else}
                    {#if changes.owner}
                        <HistRow label="Transfer Ownership" {entry} {guilds}>
                            <td>From</td>
                            <td><UserMention id={changes.owner[0]} /></td>
                            <td>To</td>
                            <td><UserMention id={changes.owner[1]} /></td>
                        </HistRow>
                    {/if}
                    {#if changes.advisor}
                        {#if changes.advisor[0]}
                            {#if changes.advisor[1]}
                                <HistRow label="Switch Advisor" {entry} {guilds}>
                                    <td>From</td>
                                    <td><UserMention id={changes.advisor[0]} /></td>
                                    <td>To</td>
                                    <td><UserMention id={changes.advisor[1]} /></td>
                                </HistRow>
                            {:else}
                                <HistRow label="Advisor Removed" {entry} {guilds}>
                                    <td>Advisor</td>
                                    <td><UserMention id={changes.advisor[0]} /></td>
                                    <td />
                                    <td />
                                </HistRow>
                            {/if}
                        {:else}
                            <HistRow label="Add Advisor" {entry} {guilds}>
                                <td>Advisor</td>
                                <td><UserMention id={changes.advisor[1]} /></td>
                                <td />
                                <td />
                            </HistRow>
                        {/if}
                    {/if}
                {/if}
                {#if changes.delegated}
                    <HistRow label="Owner {changes.delegated[0] ? 'Reclaims' : 'Delegates'} Vote" {entry} {guilds}>
                        <td>From</td>
                        <td><UserMention id={changes.voter[0]} /></td>
                        <td>To</td>
                        <td><UserMention id={changes.voter[1]} /></td>
                    </HistRow>
                {/if}
            {:else if entry.action === "users/promote" || entry.action === "users/demote" || entry.action === "users/term/refresh"}
                <HistRow
                    label={entry.action === "users/promote" ? "Promoted" : entry.action === "users/term/refresh" ? "Re-Elected" : "Demoted"}
                    {entry}
                    guilds={null}
                >
                    <td>Observer</td>
                    <td><UserMention id={entry.data.id} /></td>
                    <td />
                    <td />
                </HistRow>
            {/if}
        {/each}
    </table>
</div>
<br />
<Loading done={!loading} />
<br />
{#if done}
    <span class="text-2">(You've reached the beginning of time.)</span>
{:else}
    <button on:click={loadMore}>Load More</button>
{/if}

<style lang="scss">
    #membership-changes :global(span.mention) {
        margin-top: -13px;
    }

    #membership-changes :global(td) {
        white-space: nowrap;
    }
</style>
