<script lang="ts">
    import api from "$lib/api";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token } from "$lib/stores";
    import { withAudit } from "$lib/utils";
    import { onMount } from "svelte";

    let filter: { id: number; match: string; user: string; created: number; lastUpdated: number }[];

    async function reload() {
        filter = await api($token, "GET /global/filter").catch(alert);
    }

    onMount(async () => {
        await reload();
    });

    async function add() {
        const match = prompt("Enter a regular expression to filter.");
        if (!match) return;

        await api($token, `POST /global/filter`, match).catch(alert);
        await reload();
    }

    async function edit(id: number) {
        const match = prompt("Enter the new regular expression to filter.");
        if (!match) return;

        await api($token, `PATCH /global/filter/${id}`, match).catch(alert);
        await reload();
    }

    async function del(id: number, match: string) {
        await withAudit(
            `Confirm deleting entry ${id} (${match})`,
            async (reason) => {
                await api($token, `DELETE /global/filter/${id}`, undefined, reason).catch(alert);
            },
            false,
        );

        await reload();
    }

    let matchFilter = "";
    let searchString = "";
</script>

<h1>Global Chat Configuration</h1>
<Loading done={filter}>
    <div class="gap-1" style="display: grid; grid-template-columns: auto 1fr">
        <b>Test:</b>
        <span><input type="text" placeholder="string to test" bind:value={matchFilter} /></span>
        <b>Search:</b>
        <span><input type="text" placeholder="search regex" bind:value={searchString} /></span>
    </div>
    <p><button on:click={add}><Icon icon="add" /></button></p>
    <div class="w-100 hscroll">
        <table>
            <tr>
                <th>Regex</th>
                <th>Last Updated By</th>
                <th>Created At</th>
                <th>Last Updated At</th>
                <th />
            </tr>
            {#each filter as { id, match, user, created, lastUpdated }}
                <tr style={(matchFilter && !matchFilter.match(new RegExp(match))) || (searchString && !match.includes(searchString)) ? "display: none" : ""}>
                    <td><code style="white-space: nowrap">{match}</code></td>
                    <td><UserMention id={user} /></td>
                    <td><Mention type="time" id={`${created}`}><Timestamp ms timestamp={created} /></Mention></td>
                    <td><Mention type="time" id={`${lastUpdated}`}><Timestamp ms timestamp={lastUpdated} /></Mention></td>
                    <td>
                        <div class="row gap-1 no-wrap">
                            <button class="tp text-accent" on:click={() => edit(id)}><Icon icon="edit" /></button>
                            <button class="tp red-text" on:click={() => del(id, match)}><Icon icon="delete" /></button>
                        </div>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</Loading>
