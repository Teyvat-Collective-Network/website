<script lang="ts" context="module">
    export const statuses: Record<string, [string, string?, string?]> = {
        elected: ["Elected", "#3a3", "#070"],
        not_elected: ["Not Elected", "#f33", "#c00"],
        accepted: ["Accepted", "#55c", "#33a"],
        declined: ["Declined", "#f8f", "#808"],
        nominated: ["Nominated", "#cc5", "#a70"],
        unknown: ["?", "#999a9e", "#57595f"],
    };
</script>

<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Switch from "$lib/components/Switch.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token, user } from "$lib/stores";
    import type { ElectionHistoryRecord } from "$lib/types";
    import { onMount } from "svelte";

    let waves: { wave: number; seats: number; users: ElectionHistoryRecord[] }[];

    async function load() {
        waves = await api($token, `GET /election-history`).catch(alert);
    }

    onMount(load);

    let editing = false;

    async function addWave() {
        const rawWave = prompt("Enter the wave ID.");
        if (!rawWave) return;

        const wave = parseInt(rawWave);
        if (isNaN(wave)) return alert("Enter a valid integer.");

        await api($token, `POST /election-history/${wave}`).catch(alert);
        await load();
    }

    async function deleteWave(wave: number) {
        if (!confirm(`Are you sure you want to delete wave ${wave}? This action cannot be undone.`)) return;
        await api($token, `DELETE /election-history/${wave}`).catch(alert);
        await load();
    }

    async function editSeats(wave: number) {
        const raw = prompt("Enter the number of seats for this election.");
        if (!raw) return;

        const num = parseInt(raw);
        if (isNaN(num) || num < 0 || num % 1 !== 0) return alert("Please entry a non-negative integer.");

        await api($token, `PATCH /election-history/${wave}`, { seats: num }).catch(alert);
        await load();
    }

    async function addUser(wave: number) {
        const user = prompt("Enter the ID of the user to add.");
        if (!user) return;

        await api($token, `POST /election-history/${wave}/${user}`).catch(alert);
        await load();
    }

    async function deleteUser(wave: number, id: string) {
        if (!confirm(`Are you sure you want to remove ${id} from wave ${wave}? This action cannot be undone except through adding them back.`)) return;
        await api($token, `DELETE /election-history/${wave}/${id}`).catch(alert);
        await load();
    }

    async function setStatus(wave: number, id: string, status: string) {
        await api($token, `PATCH /election-history/${wave}/${id}`, { status }).catch(alert);
        await load();
    }

    async function setRerunning(wave: number, id: string, rerunning: boolean) {
        await api($token, `PATCH /election-history/${wave}/${id}`, { rerunning }).catch(alert);
        await load();
    }
</script>

<h1>Election History</h1>
{#if $user?.observer}
    <span class="row gap-1">
        <button on:click={() => (editing = !editing)}>{editing ? "View Mode" : "Edit Mode"}</button>
        {#if editing}
            <button on:click={addWave}>New Wave</button>
        {/if}
    </span>
    <br />
{/if}
<Loading done={waves}>
    {#each waves as { wave, seats, users }}
        <div class="panel">
            <h4 class="short row gap-1">
                {#if editing}
                    <A class="row red-text" on:click={() => deleteWave(wave)}><Icon icon="delete" /></A>
                {/if}
                Wave {wave}
            </h4>
            <h6 class="short row gap-1 text-2">
                <span>Seats: {seats}</span>
                {#if editing}
                    <A class="row" on:click={() => editSeats(wave)}><Icon icon="edit" /></A>
                {/if}
            </h6>
            <div class="w-100 hscroll">
                <table>
                    <tr>
                        <th>Nominee / Candidate</th>
                        <th>Status</th>
                        <th>Rerunning?</th>
                    </tr>
                    {#each users as { id, status, rerunning }}
                        {@const [label, dark, light] = statuses[status]}
                        <tr>
                            <td>
                                <span class="row no-wrap gap-1">
                                    {#if editing}
                                        <A class="row red-text" on:click={() => deleteUser(wave, id)}><Icon icon="delete" /></A>
                                    {/if}
                                    <UserMention {id} />
                                </span>
                            </td>
                            <td>
                                {#if editing}
                                    <select class="bg-1" value={status} on:input={(e) => setStatus(wave, id, e.currentTarget.value)}>
                                        {#each Object.entries(statuses) as [key, [label]]}
                                            <option value={key}>{label}</option>
                                        {/each}
                                    </select>
                                {:else}
                                    <b class="dark" style="color: {dark}">{label}</b>
                                    <b class="light" style="color: {light}">{label}</b>
                                {/if}
                            </td>
                            <td>
                                {#if editing}
                                    <span class="col">
                                        <Switch on={rerunning} on:toggle={(x) => setRerunning(wave, id, x.detail)} />
                                    </span>
                                {:else if rerunning}
                                    Yes
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </table>
            </div>
            {#if editing}
                <br />
                <button on:click={() => addUser(wave)}>Add User</button>
            {/if}
        </div>
    {/each}
</Loading>
