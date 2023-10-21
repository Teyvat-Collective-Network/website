<script lang="ts">
    import api from "$lib/api";
    import { token, user } from "$lib/stores";
    import type { AuditLogEntry } from "$lib/types";
    import GuildMention from "./GuildMention.svelte";
    import Icon from "./Icon.svelte";
    import Mention from "./Mention.svelte";
    import Timestamp from "./Timestamp.svelte";

    export let show: boolean;
    export let label: string;
    export let entry: AuditLogEntry;
    export let guilds: Set<string> | null;

    async function toggleHide() {
        try {
            await api($token, `PATCH /audit-logs/${entry.uuid}`, { hidden: !entry.hidden });
            entry.hidden = !entry.hidden;
        } catch (error) {
            alert(error);
        }
    }

    let rendered: string;

    if (entry.reason)
        try {
            fetch(`/api/render`, { method: "POST", body: entry.reason })
                .then((x) => x.text())
                .then((x) => (rendered = x));
        } catch {}
</script>

{#if !entry.hidden || $user?.observer}
    <tr id="hist-row" class={entry.hidden ? "red-text" : ""} style={show ? "" : "display: none"}>
        {#if $user?.observer}
            <td>
                <button class="tp {entry.hidden ? 'green-text' : 'red-text'}" on:click={toggleHide}>
                    <Icon icon={entry.hidden ? "visibility" : "visibility_off"} />
                </button>
            </td>
        {:else}
            <span />
        {/if}
        <td><Mention type="time" id={`${Math.floor(entry.time / 1000)}`}><Timestamp ms mode="date" timestamp={entry.time} /></Mention></td>
        <td>
            {#if guilds?.has(entry.data.id)}
                <GuildMention id={entry.data.id} name={entry.data.name} />
            {:else if guilds}
                <Mention type="guild" id={entry.data.id}>{entry.data.name}</Mention>
            {/if}
        </td>
        <td><b>{label}</b></td>
        <slot />
        {#if entry.reason}
            <td>Notes</td>
            <td>
                {#if rendered}
                    <span class="notes">
                        {@html rendered}
                    </span>
                {:else}
                    {entry.reason}
                {/if}
            </td>
        {:else}
            <td />
            <td />
        {/if}
    </tr>
{/if}

<style lang="scss">
    :global(.notes p) {
        margin: 0;
    }

    :global(#hist-row td:nth-child(2n + 5)) {
        font-size: 75%;
        text-transform: uppercase;
        border-right: none;
        padding-right: 0.25em;
    }

    :global(#hist-row:not(.red-text) td:nth-child(2n + 5)) {
        color: rgb(var(--text-2));
    }

    :global(#hist-row td:nth-child(2n + 6)) {
        border-left: none;
        padding-left: 0.25em;
    }
</style>
