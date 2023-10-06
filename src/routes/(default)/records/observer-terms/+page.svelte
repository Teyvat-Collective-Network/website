<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token, user } from "$lib/stores";
    import type { User } from "$lib/types";
    import { withAudit } from "$lib/utils";
    import { onMount } from "svelte";

    let users: User[];
    const dates: Record<string, { start: number; end: number; elect: number }> = {};
    const tags: Record<string, string> = {};

    async function load() {
        users = await api($token, `GET /users?observers=true`).catch(alert);

        if (users)
            for (const { id, observerSince } of users) {
                const date = new Date(observerSince);

                const end = date;
                end.setMonth(end.getMonth() + 6);

                const elect = end;
                elect.setDate(elect.getDate() - 9);

                dates[id] = { start: observerSince, end: end.getTime(), elect: elect.getTime() };
            }
    }

    onMount(() => load());

    async function refresh(id: string) {
        await withAudit(
            `Refresh ${tags[id] ?? id}'s term? This will set their term start time to right now.`,
            async (reason) => {
                await api($token, `POST /users/${id}/refresh`, undefined, reason).catch(alert);
                await load();
            },
            true,
        );
    }
</script>

<h1>Observer Terms</h1>
<Loading done={users}>
    <div class="w-100 hscroll">
        <table class="w-100">
            <tr>
                <th>Observer</th>
                <th>Term Start</th>
                <th>Scheduled Term End</th>
                <th>Predicted Election Start</th>
            </tr>
            {#each users.sort(({ id: x }, { id: y }) => dates[x].start - dates[y].start) as { id }}
                <tr>
                    <td>
                        <span class="row gap-1" style="margin-top: -2px">
                            {#if $user?.observer}
                                <A class="row" on:click={() => refresh(id)}><Icon icon="refresh" /></A>
                                <A class="row" to="/admin/api-manager/users/{id}" external><Icon icon="edit" /></A>
                            {/if}
                            <UserMention {id} bind:tag={tags[id]} />
                        </span>
                    </td>
                    <td><Mention type="time"><Timestamp ms mode="date" timestamp={dates[id]?.start ?? 0} /></Mention></td>
                    <td class={dates[id]?.end < Date.now() ? "red-text" : ""}>
                        <Mention type="time"><Timestamp ms mode="date" timestamp={dates[id]?.end ?? 0} /></Mention>
                    </td>
                    <td class={dates[id]?.elect < Date.now() ? "yellow-text" : ""}>
                        <Mention type="time"><Timestamp ms mode="date" timestamp={dates[id]?.elect ?? 0} /></Mention>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</Loading>
