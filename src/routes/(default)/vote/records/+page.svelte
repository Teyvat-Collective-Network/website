<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token } from "$lib/stores";
    import type { PollResponse } from "$lib/types";
    import { onMount } from "svelte";

    let records: { polls: PollResponse[]; votes: { id: number; user: string; voted: boolean }[]; ids: string[] };
    const map: Record<number, Record<string, boolean>> = {};

    let reversed: PollResponse[];

    const key = (id: string) => {
        let val = 0;

        for (const poll of records.polls) {
            const voted = map[poll.id][id];

            if (voted === true) val = 0.8 * val;
            else if (voted === false) val = 0.6 * val + 0.4;
        }

        return val;
    };

    onMount(async () => {
        records = await api($token, `GET /polls/records`).catch(alert);
        if (!records) return;

        records.polls.sort((x, y) => y.id - x.id);
        reversed = records.polls.toReversed();
        for (const { id, user, voted } of records.votes) (map[id] ??= {})[user] = voted;

        records.ids.sort((x, y) => key(y) - key(x));
    });
</script>

<A to="/vote">Voting Center</A>
<br /><br />
<Loading done={records}>
    <table>
        <tr>
            <th class="left-align">User</th>
            <th class="left-align">Absence Score</th>
            {#each records.polls as poll}
                <th
                    style="cursor: default"
                    title={poll.mode === "proposal" || poll.mode === "selection"
                        ? poll.question
                        : poll.mode === "induction"
                        ? `Induct ${poll.server}?`
                        : poll.mode === "election"
                        ? `Please vote in the Wave ${poll.wave} Election.`
                        : "?"}>{poll.id}</th
                >
            {/each}
        </tr>
        {#each records.ids as id, index}
            <tr class="bg-{3 - (index % 2) * 2}">
                <td><UserMention {id} /></td>
                <td><code>{key(id).toFixed(2)}</code></td>
                {#each records.polls as poll}
                    {@const status = map[poll.id][id]}
                    {@const key = status === true ? 0 : status === false ? 1 : 2}
                    <td class="center" style="cursor: default" title={["voted", "missing vote", "not eligible"][key]}>{["✅", "❌", "-"][key]}</td>
                {/each}
            </tr>
        {/each}
    </table>
</Loading>

<style lang="scss">
    div#table-wrapper {
        overflow-x: scroll;
    }

    table,
    tr,
    th,
    td {
        border: none;
    }

    td,
    th {
        padding: 8px;
    }
</style>
