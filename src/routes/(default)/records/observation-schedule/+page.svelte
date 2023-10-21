<script lang="ts" context="module">
    export const results = {
        pending: ["Pending", true, true, "#f8f", "#808"],
        rejection_vote: ["Voting To Reject", false, false, "#b66", "#a33"],
        retracted: ["Retracted", true, false, "#c5c", "#a3a"],
        declined: ["Declined", false, false, "#f33", "#c00"],
        rejected: ["Rejected", true, true, "#f62", "#c40"],
        canceled: ["Canceled", true, false, "#f94", "#c62"],
        observing: ["Observing", true, true, "#55c", "#33a"],
        observed: ["Observed", true, true, "#38a", "#36a"],
        report_wip: ["Report WIP", true, true, "#77c", "#47a"],
        vote_waiting: ["Waiting To Vote", true, true, "#88f", "#44c"],
        voting: ["Voting", true, true, "#aaf", "#55f"],
        inducted: ["Inducted", true, true, "#3a3", "#070"],
        preapproved: ["Pre-Approved", true, true, "#cc5", "#a70"],
    } as Record<string, [string, boolean, boolean, string?, string?]>;

    const timeValues = [
        ["start", "showStart"],
        ["end", "showEnd"],
    ] as const;
</script>

<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import GuildMention from "$lib/components/GuildMention.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token, user } from "$lib/stores";
    import type { Guild, ObservationRecord } from "$lib/types";
    import { withAudit } from "$lib/utils";
    import { onMount } from "svelte";

    let entries: ObservationRecord[] = [];
    const guildNames: Record<string, string> = {};

    async function load() {
        entries = await api($token, `GET /observation-records`).catch(alert);

        if (entries) {
            statuses = Object.fromEntries(entries.map((e) => [e.uuid, e.status]));
            notes = Object.fromEntries(entries.map((e) => [e.uuid, e.notes]));
        }

        const guilds: Guild[] = await api($token, `GET /guilds`).catch(alert);
        for (const guild of guilds) guildNames[guild.id] = guild.name;
    }

    onMount(load);

    async function save(uuid: number, message: string, obj: any) {
        return await withAudit(
            message,
            async (reason) => {
                await api($token, `PATCH /observation-records/${uuid}`, obj, reason).catch(alert);
                await load();
            },
            false,
        );
    }

    async function toggleHide(entry: ObservationRecord) {
        await save(entry.uuid, `Make this entry ${entry.hidden ? "visible" : "hidden"}?`, { hidden: !entry.hidden });
    }

    async function editName(uuid: number) {
        const name = prompt("Enter the name override for this server. Enter an empty value to remove it. Cancel (Esc) to cancel.")?.trim();
        if (name === undefined) return;

        await save(uuid, name ? `Set the name override to ${name}?` : "Remove the name override?", { name: name || null });
    }

    async function editObserver(uuid: number) {
        const id = prompt("Enter the ID of the observer to assign to this server.");
        if (!id) return;

        await save(uuid, `Assign ${id} as the observer of this applicant?`, { observer: id });
    }

    async function deleteObserver(uuid: number) {
        await save(uuid, `Unassign the observer of this applicant?`, { observer: null });
    }

    async function editTime(uuid: number, key: "start" | "end") {
        const rawTime = prompt("Enter the date as YYYY-MM-DD.");
        if (!rawTime) return;
        if (!rawTime.match(/^\d{4}-\d\d-\d\d$/)) return alert("Invalid format.");

        const [y, m, d] = rawTime.split("-");
        const time = new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime();

        await save(uuid, `Set the ${key} time of this observation to ${rawTime}?`, { [key]: time });
    }

    async function deleteTime(uuid: number, key: "start" | "end") {
        await save(uuid, `Remove the ${key} time of this observation?`, { [key]: null });
    }

    let statuses: Record<number, string> = {};

    async function editStatus(uuid: number, status: string) {
        const reason = await save(uuid, `Set the status of this observation to ${results[status][0]}?`, { status });
        if (reason === null) statuses[uuid] = entries.find((x) => x.uuid === uuid)!.status;
    }

    let notes: Record<number, string> = {};

    async function editNotes(uuid: number) {
        await save(uuid, `Set the notes for this applicant / observation?`, { notes: notes[uuid] });
    }

    let editing = false;
</script>

<h1>Observation Schedule</h1>
{#if $user?.observer}
    <button on:click={() => (editing = !editing)}>{editing ? "View Mode" : "Edit Mode"}</button>
    <br />
{/if}
<Loading done={entries}>
    <div class="w-100 hscroll">
        <table>
            <tr>
                <th />
                <th>Guild</th>
                <th>Observer</th>
                <th>Observation Start</th>
                <th>Observation End</th>
                <th>Status</th>
                <th>Notes</th>
            </tr>
            {#each editing ? entries : entries.filter((x) => !x.hidden) as entry}
                {@const [label, showStart, showEnd, dark, light] = results[entry.status]}
                <tr>
                    <td>
                        <span class="row no-wrap gap-1">
                            <span><code>{entry.uuid}</code></span>
                            {#if editing}
                                <A class="row {entry.hidden ? 'blue-text' : 'red-text'}" on:click={() => toggleHide(entry)}>
                                    <Icon icon={entry.hidden ? "visibility" : "visibility_off"} />
                                </A>
                            {/if}
                        </span>
                    </td>
                    <td>
                        <span class="row no-wrap gap-1">
                            {#if guildNames[entry.id]}
                                <GuildMention id={entry.id} {guildNames} name={entry.name} />
                            {:else}
                                <Mention type="guild" id={entry.id}>{entry.name ?? entry.id}</Mention>
                            {/if}
                            {#if editing}
                                <A class="row" on:click={() => editName(entry.uuid)}><Icon icon="edit" /></A>
                            {/if}
                        </span>
                    </td>
                    <td>
                        <span class="row no-wrap gap-1">
                            {#if showStart || showEnd}
                                {#if entry.observer}
                                    <UserMention id={entry.observer} />
                                {:else}
                                    <span class="text-2">(none)</span>
                                {/if}
                                {#if editing}
                                    <A class="row" on:click={() => editObserver(entry.uuid)}><Icon icon="edit" /></A>
                                    <A class="row red-text" on:click={() => deleteObserver(entry.uuid)}><Icon icon="delete" /></A>
                                {/if}
                            {:else}
                                <span class="text-2">(N/A)</span>
                            {/if}
                        </span>
                    </td>
                    {#each timeValues as [key, show]}
                        <td>
                            {#if show === "showStart" ? showStart : showEnd}
                                <span class="row gap-1 no-wrap">
                                    {#if entry[key] || (key === "end" && entry.start)}
                                        <Mention type="time">
                                            <Timestamp ms mode="date" timestamp={entry[key] ?? (entry.start ?? 0) + 28 * 24 * 60 * 60 * 1000} />
                                        </Mention>
                                    {:else}
                                        <span class="text-2">(none)</span>
                                    {/if}
                                    {#if editing}
                                        <A class="row" on:click={() => editTime(entry.uuid, key)}><Icon icon="edit" /></A>
                                        <A class="row red-text" on:click={() => deleteTime(entry.uuid, key)}><Icon icon="delete" /></A>
                                    {/if}
                                </span>
                            {:else}
                                <span class="text-2">(N/A)</span>
                            {/if}
                        </td>
                    {/each}
                    <td>
                        {#if editing}
                            <select bind:value={statuses[entry.uuid]} on:input={(e) => editStatus(entry.uuid, e.currentTarget.value)}>
                                {#each Object.entries(results) as [key, [label]]}
                                    <option value={key}>{label}</option>
                                {/each}
                            </select>
                        {:else}
                            <b class="dark" style="color: {dark}">{label}</b>
                            <b class="light" style="color:{light}">{label}</b>
                        {/if}
                    </td>
                    <td>
                        {#if editing}
                            <span class="row no-wrap gap-1">
                                <input type="text" class={notes[entry.uuid].trim() === entry.notes ? "" : "unsaved"} bind:value={notes[entry.uuid]} />
                                <A class="row" on:click={() => notes[entry.uuid].trim() !== entry.notes && editNotes(entry.uuid)}><Icon icon="save" /></A>
                                <A class="row red-text" on:click={() => (notes[entry.uuid] = entry.notes)}>
                                    <Icon icon="restore" />
                                </A>
                            </span>
                        {:else}
                            {entry.notes}
                        {/if}
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</Loading>

<style lang="scss">
    .unsaved {
        outline: 2px solid rgb(var(--red-text));
    }
</style>
